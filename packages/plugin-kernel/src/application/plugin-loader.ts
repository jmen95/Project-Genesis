import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { IFilesystem } from '@genesis/core';

import type { GenesisPlugin } from '../application/genesis-plugin.js';
import type { PluginLoadError } from '../domain/plugin-load-error.js';
import type { PluginManifest } from '../domain/plugin-manifest.js';

export async function loadPluginModule(
  filesystem: IFilesystem,
  pluginRoot: string,
  manifest: PluginManifest,
  pluginId: string,
): Promise<{ readonly plugin?: GenesisPlugin; readonly error?: PluginLoadError }> {
  const entryPath = join(pluginRoot, manifest.main);

  if (!(await filesystem.exists(entryPath))) {
    return {
      error: {
        pluginId,
        stage: 'validate-entry',
        reason: `Entry point not found: ${manifest.main}`,
      },
    };
  }

  try {
    const moduleUrl = pathToFileURL(entryPath).href;
    const loaded = (await import(moduleUrl)) as { default?: GenesisPlugin; plugin?: GenesisPlugin };
    const plugin = loaded.default ?? loaded.plugin;

    if (!plugin || typeof plugin.register !== 'function' || typeof plugin.onLoad !== 'function') {
      return {
        error: {
          pluginId,
          stage: 'contract-check',
          reason: 'Plugin module does not export a valid GenesisPlugin',
        },
      };
    }

    return { plugin };
  } catch (error) {
    return {
      error: {
        pluginId,
        stage: 'import',
        reason: error instanceof Error ? error.message : String(error),
        ...(error instanceof Error ? { cause: error } : {}),
      },
    };
  }
}
