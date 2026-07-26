import { join } from 'node:path';

import { PLUGIN_MANIFEST_FILE, type PluginManifest } from '@genesis/plugin-kernel';

import { PluginDefinitionError } from '../errors/plugin-definition.error.js';
import type { PluginDefinition } from '../types.js';

export interface PluginFilesystem {
  exists(path: string): Promise<boolean>;
  read(path: string): Promise<string>;
}

export interface DiscoveredManifest {
  readonly name: string;
  readonly version: string;
  readonly genesisVersion: string;
}

export async function readDiscoveredManifest(
  filesystem: PluginFilesystem,
  pluginRoot: string,
): Promise<DiscoveredManifest> {
  const manifestPath = join(pluginRoot, PLUGIN_MANIFEST_FILE);
  if (!(await filesystem.exists(manifestPath))) {
    throw new PluginDefinitionError(
      'PDEF-002',
      'unknown',
      `Missing discovery manifest: ${PLUGIN_MANIFEST_FILE}`,
    );
  }

  const raw = await filesystem.read(manifestPath);
  const parsed = JSON.parse(raw) as Partial<PluginManifest>;

  if (!parsed.name || !parsed.version || !parsed.genesisVersion) {
    throw new PluginDefinitionError(
      'PDEF-002',
      parsed.name ?? 'unknown',
      `${PLUGIN_MANIFEST_FILE} must include name, version, and genesisVersion`,
    );
  }

  return {
    name: parsed.name,
    version: parsed.version,
    genesisVersion: parsed.genesisVersion,
  };
}

export function validateDefinitionMatchesManifest(
  definition: PluginDefinition,
  discovered: DiscoveredManifest,
): void {
  if (definition.id !== discovered.name) {
    throw new PluginDefinitionError(
      'PDEF-003',
      definition.id,
      `Plugin id mismatch: definePlugin id "${definition.id}" does not match ${PLUGIN_MANIFEST_FILE} name "${discovered.name}"`,
      'id',
    );
  }

  if (definition.version !== discovered.version) {
    throw new PluginDefinitionError(
      'PDEF-003',
      definition.id,
      `Plugin version mismatch: definePlugin version "${definition.version}" does not match ${PLUGIN_MANIFEST_FILE} version "${discovered.version}"`,
      'version',
    );
  }

  if (definition.genesisVersion !== discovered.genesisVersion) {
    throw new PluginDefinitionError(
      'PDEF-003',
      definition.id,
      `Genesis version mismatch: definePlugin genesisVersion "${definition.genesisVersion}" does not match ${PLUGIN_MANIFEST_FILE} genesisVersion "${discovered.genesisVersion}"`,
      'genesisVersion',
    );
  }
}
