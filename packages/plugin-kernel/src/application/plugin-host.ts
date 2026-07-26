import { join } from 'node:path';

import type { IFilesystem, ILogger } from '@genesis/core';

import { RegistryError } from '../domain/errors/registry.errors.js';
import type { PluginLoadError } from '../domain/plugin-load-error.js';
import type { PluginManifest } from '../domain/plugin-manifest.js';
import type { PluginContributions, PluginRecord } from '../domain/plugin-record.js';
import type { PluginState } from '../domain/plugin-state.js';
import type { RegistryEntry } from '../domain/registry-entry.js';
import { discoverPlugins } from '../infrastructure/plugin-discovery.js';
import { resolveDependencyOrder, validatePluginManifest } from './dependency-resolver.js';
import { HookRunner } from './hook-runner.js';
import { PluginRegistriesInternal } from './internal-registries.js';
import { createPluginContext } from './plugin-context.js';
import { loadPluginModule } from './plugin-loader.js';

export interface PluginHostOptions {
  readonly filesystem: IFilesystem;
  readonly logger: ILogger;
  readonly genesisVersion: string;
  readonly searchPaths: readonly string[];
}

interface MutablePluginRecord {
  id: string;
  manifest: PluginManifest;
  pluginRoot: string;
  state: PluginState;
  loadOrder: number;
  errors: PluginLoadError[];
}

function emptyContributions(): PluginContributions {
  return { templates: [], validators: [], commands: [], hooks: [] };
}

function mergeDiscoveredManifest(
  discovered: PluginManifest,
  fromPlugin: PluginManifest,
): PluginManifest {
  return {
    ...discovered,
    ...fromPlugin,
    name: fromPlugin.name || discovered.name,
    version: fromPlugin.version || discovered.version,
    genesisVersion: fromPlugin.genesisVersion || discovered.genesisVersion,
    ...(fromPlugin.capabilities !== undefined && fromPlugin.capabilities.length > 0
      ? { capabilities: fromPlugin.capabilities }
      : discovered.capabilities !== undefined
        ? { capabilities: discovered.capabilities }
        : {}),
    ...(fromPlugin.dependencies !== undefined ? { dependencies: fromPlugin.dependencies } : {}),
    ...(fromPlugin.templates !== undefined ? { templates: fromPlugin.templates } : {}),
  };
}

function pluginEntries<T>(entries: readonly RegistryEntry<T>[], pluginId: string): T[] {
  return entries.filter((entry) => entry.pluginId === pluginId).map((entry) => entry.value);
}

function toRecord(record: MutablePluginRecord, registries: PluginRegistriesInternal): PluginRecord {
  return {
    id: record.id,
    manifest: record.manifest,
    pluginRoot: record.pluginRoot,
    state: record.state,
    loadOrder: record.loadOrder,
    errors: record.errors,
    contributions: {
      templates: pluginEntries(registries.templates.list(), record.id),
      validators: pluginEntries(registries.validators.list(), record.id),
      commands: pluginEntries(registries.commands.list(), record.id),
      hooks: pluginEntries(registries.hooks.list(), record.id),
    },
  };
}

export class PluginHost {
  private readonly filesystem: IFilesystem;
  private readonly logger: ILogger;
  private readonly genesisVersion: string;
  private readonly searchPaths: readonly string[];
  private readonly registries = new PluginRegistriesInternal();
  private readonly hookRunner: HookRunner;
  private readonly records = new Map<string, MutablePluginRecord>();

  constructor(options: PluginHostOptions) {
    this.filesystem = options.filesystem;
    this.logger = options.logger;
    this.genesisVersion = options.genesisVersion;
    this.searchPaths = options.searchPaths;
    this.hookRunner = new HookRunner(this.registries);
  }

  async discover(): Promise<readonly PluginRecord[]> {
    const discovered = await discoverPlugins(this.filesystem, this.searchPaths);

    for (const candidate of discovered) {
      let manifest: PluginManifest;
      try {
        const raw = await this.filesystem.read(candidate.manifestPath);
        manifest = JSON.parse(raw) as PluginManifest;
      } catch (error) {
        const pluginId = candidate.pluginRoot.split('/').pop() ?? candidate.pluginRoot;
        this.records.set(pluginId, {
          id: pluginId,
          manifest: {
            name: pluginId,
            version: '0.0.0',
            apiVersion: '1.x',
            genesisVersion: '*',
            description: '',
            main: '',
            capabilities: [],
          },
          pluginRoot: candidate.pluginRoot,
          state: 'failed',
          loadOrder: -1,
          errors: [
            {
              pluginId,
              stage: 'validate-manifest',
              reason: error instanceof Error ? error.message : 'Failed to parse manifest',
            },
          ],
        });
        continue;
      }

      const pluginId = manifest.name;
      this.records.set(pluginId, {
        id: pluginId,
        manifest,
        pluginRoot: candidate.pluginRoot,
        state: 'discovered',
        loadOrder: -1,
        errors: [],
      });
    }

    return this.listPlugins();
  }

  async loadAll(): Promise<readonly PluginRecord[]> {
    if (this.records.size === 0) {
      await this.discover();
    }

    const manifestMap = new Map<string, PluginManifest>();
    for (const record of this.records.values()) {
      if (record.state !== 'failed') {
        manifestMap.set(record.id, record.manifest);
      }
    }

    for (const [pluginId, manifest] of manifestMap.entries()) {
      const validation = validatePluginManifest(manifest, this.genesisVersion, pluginId);
      const record = this.records.get(pluginId);
      if (!record) {
        continue;
      }

      if (!validation.ok) {
        record.state = 'failed';
        record.errors = [...record.errors, ...validation.errors];
        continue;
      }

      record.state = 'validated';
    }

    const { order, errors: orderErrors } = resolveDependencyOrder(manifestMap);
    if (orderErrors.length > 0) {
      for (const error of orderErrors) {
        const record = this.records.get(error.pluginId);
        if (record) {
          record.state = 'failed';
          record.errors.push(error);
        }
      }
    }

    let loadOrder = 0;
    for (const pluginId of order) {
      const record = this.records.get(pluginId);
      if (!record || record.state !== 'validated') {
        continue;
      }

      record.loadOrder = loadOrder;
      loadOrder += 1;

      await this.loadPlugin(record);
    }

    this.registries.closeRegistration();
    return this.listPlugins();
  }

  listPlugins(): readonly PluginRecord[] {
    return [...this.records.values()]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((record) =>
        record.state === 'registered'
          ? toRecord(record, this.registries)
          : {
              id: record.id,
              manifest: record.manifest,
              pluginRoot: record.pluginRoot,
              state: record.state,
              loadOrder: record.loadOrder,
              errors: record.errors,
              contributions: emptyContributions(),
            },
      );
  }

  getPlugin(id: string): PluginRecord | undefined {
    return this.listPlugins().find((record) => record.id === id);
  }

  getHookRunner(): HookRunner {
    return this.hookRunner;
  }

  getTemplateRegistrations() {
    return this.registries.templates.list();
  }

  getValidatorRegistrations() {
    return this.registries.validators.list();
  }

  private async loadPlugin(record: MutablePluginRecord): Promise<boolean> {
    const { plugin, error } = await loadPluginModule(
      this.filesystem,
      record.pluginRoot,
      record.manifest,
      record.id,
    );

    if (error) {
      record.state = 'failed';
      record.errors.push(error);
      return false;
    }

    if (!plugin) {
      record.state = 'failed';
      record.errors.push({
        pluginId: record.id,
        stage: 'import',
        reason: 'Plugin module did not export a plugin',
      });
      return false;
    }

    record.manifest = mergeDiscoveredManifest(record.manifest, plugin.manifest);

    const context = createPluginContext({
      manifest: record.manifest,
      pluginRoot: record.pluginRoot,
      genesisVersion: this.genesisVersion,
      logger: this.logger,
      filesystem: this.filesystem,
      registries: this.registries,
      loadOrder: record.loadOrder,
    });

    try {
      await plugin.onLoad(context);
      record.state = 'loaded';
    } catch (error) {
      record.state = 'failed';
      if (error && typeof error === 'object' && 'pluginLoadError' in error) {
        record.errors.push((error as { pluginLoadError: PluginLoadError }).pluginLoadError);
      } else {
        record.errors.push({
          pluginId: record.id,
          stage: 'onLoad',
          reason: error instanceof Error ? error.message : String(error),
          ...(error instanceof Error ? { cause: error } : {}),
        });
      }
      return false;
    }

    try {
      plugin.register(context);
      record.state = 'registered';
      return true;
    } catch (error) {
      record.state = 'failed';
      const reason =
        error instanceof RegistryError
          ? `${error.registryCode}: ${error.message}`
          : error instanceof Error
            ? error.message
            : String(error);
      record.errors.push({
        pluginId: record.id,
        stage: 'register',
        reason,
        ...(error instanceof Error ? { cause: error } : {}),
      });
      return false;
    }
  }
}

export function createPluginHost(options: PluginHostOptions): PluginHost {
  return new PluginHost(options);
}

export function resolveDefaultPluginSearchPaths(projectRoot: string): string[] {
  const paths = [join(projectRoot, 'packages', 'plugins')];
  const fromEnv = process.env['GENESIS_PLUGIN_PATH'];
  if (fromEnv) {
    paths.push(...fromEnv.split(':').filter((segment: string) => segment.length > 0));
  }
  return paths;
}
