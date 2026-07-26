import type { IFilesystem, ILogger } from '@genesis/core';

import type {
  CommandRegistration,
  HookRegistration,
  TemplateRegistration,
  ValidatorRegistration,
} from '../domain/contributions.js';
import type { PluginManifest } from '../domain/plugin-manifest.js';
import type { PluginRegistriesInternal } from './internal-registries.js';

export interface PluginContext {
  readonly manifest: PluginManifest;
  readonly pluginRoot: string;
  readonly genesisVersion: string;
  readonly logger: ILogger;
  readonly filesystem: IFilesystem;

  registerTemplate(contribution: TemplateRegistration): void;
  registerValidator(contribution: ValidatorRegistration): void;
  registerCommand(contribution: CommandRegistration): void;
  registerHook(contribution: HookRegistration): void;
}

export interface CreatePluginContextOptions {
  readonly manifest: PluginManifest;
  readonly pluginRoot: string;
  readonly genesisVersion: string;
  readonly logger: ILogger;
  readonly filesystem: IFilesystem;
  readonly registries: PluginRegistriesInternal;
  readonly loadOrder: number;
}

export function createPluginContext(options: CreatePluginContextOptions): PluginContext {
  const registerOptions = {
    pluginId: options.manifest.name,
    pluginVersion: options.manifest.version,
    loadOrder: options.loadOrder,
    capabilities: options.manifest.capabilities ?? [],
  };

  return {
    manifest: options.manifest,
    pluginRoot: options.pluginRoot,
    genesisVersion: options.genesisVersion,
    logger: options.logger,
    filesystem: options.filesystem,

    registerTemplate(contribution: TemplateRegistration): void {
      options.registries.templates.register(contribution.templateId, contribution, {
        ...registerOptions,
        ...(contribution.priority !== undefined ? { priority: contribution.priority } : {}),
      });
    },

    registerValidator(contribution: ValidatorRegistration): void {
      options.registries.validators.register(contribution.ruleId, contribution, {
        ...registerOptions,
        ...(contribution.priority !== undefined ? { priority: contribution.priority } : {}),
      });
    },

    registerCommand(contribution: CommandRegistration): void {
      options.registries.commands.register(contribution.commandId, contribution, registerOptions);
    },

    registerHook(contribution: HookRegistration): void {
      options.registries.hooks.register(contribution.hookId, contribution, {
        ...registerOptions,
        ...(contribution.priority !== undefined ? { priority: contribution.priority } : {}),
      });
    },
  };
}
