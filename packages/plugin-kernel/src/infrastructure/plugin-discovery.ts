import { join } from 'node:path';

import type { IFilesystem } from '@genesis/core';

import { PLUGIN_MANIFEST_FILE } from '../domain/plugin-manifest.js';

export interface DiscoveredPlugin {
  readonly pluginRoot: string;
  readonly manifestPath: string;
}

export async function discoverPlugins(
  filesystem: IFilesystem,
  searchPaths: readonly string[],
): Promise<DiscoveredPlugin[]> {
  const discovered: DiscoveredPlugin[] = [];
  const seenRoots = new Set<string>();

  for (const searchPath of searchPaths) {
    if (!(await filesystem.exists(searchPath))) {
      continue;
    }

    const entries = await filesystem.readDir(searchPath);
    for (const entry of entries.sort()) {
      const pluginRoot = join(searchPath, entry);
      if (seenRoots.has(pluginRoot)) {
        continue;
      }

      const stat = await filesystem.stat(pluginRoot);
      if (!stat.isDirectory) {
        continue;
      }

      const manifestPath = join(pluginRoot, PLUGIN_MANIFEST_FILE);
      if (!(await filesystem.exists(manifestPath))) {
        continue;
      }

      seenRoots.add(pluginRoot);
      discovered.push({ pluginRoot, manifestPath });
    }
  }

  return discovered.sort((left, right) => left.pluginRoot.localeCompare(right.pluginRoot));
}
