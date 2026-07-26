import { isPluginCapability } from '../domain/plugin-capability.js';
import type { PluginLoadError } from '../domain/plugin-load-error.js';
import type { PluginManifest } from '../domain/plugin-manifest.js';
import { isValidSemver, satisfiesGenesisVersion, validatePluginId } from './manifest-validator.js';

export interface ManifestValidationResult {
  readonly ok: boolean;
  readonly errors: readonly PluginLoadError[];
}

export function validatePluginManifest(
  manifest: PluginManifest,
  genesisVersion: string,
  pluginId: string,
): ManifestValidationResult {
  const errors: PluginLoadError[] = [];

  const push = (stage: PluginLoadError['stage'], reason: string): void => {
    errors.push({ pluginId, stage, reason });
  };

  if (!manifest.name || !manifest.version || !manifest.main || !manifest.description) {
    push('validate-manifest', 'Manifest missing required fields');
  }

  const idError = validatePluginId(manifest.name ?? pluginId);
  if (idError) {
    push('validate-id', idError);
  }

  if (manifest.version && !isValidSemver(manifest.version)) {
    push('validate-manifest', `Invalid plugin version: ${manifest.version}`);
  }

  if (
    manifest.genesisVersion &&
    !satisfiesGenesisVersion(manifest.genesisVersion, genesisVersion)
  ) {
    push(
      'validate-genesis-version',
      `Genesis ${genesisVersion} does not satisfy ${manifest.genesisVersion}`,
    );
  }

  if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
    push('validate-capabilities', 'At least one capability is required');
  } else {
    for (const capability of manifest.capabilities) {
      if (!isPluginCapability(capability)) {
        push('validate-capabilities', `Unknown capability: ${capability}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function resolveDependencyOrder(manifests: ReadonlyMap<string, PluginManifest>): {
  readonly order: readonly string[];
  readonly errors: readonly PluginLoadError[];
} {
  const ids = [...manifests.keys()].sort();
  const errors: PluginLoadError[] = [];
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of ids) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const [id, manifest] of manifests.entries()) {
    const dependencies = Object.keys(manifest.dependencies ?? {}).sort();
    for (const dependency of dependencies) {
      if (!manifests.has(dependency)) {
        errors.push({
          pluginId: id,
          stage: 'validate-dependencies',
          reason: `Missing dependency "${dependency}"`,
        });
        continue;
      }
      adjacency.get(dependency)?.push(id);
      inDegree.set(id, (inDegree.get(id) ?? 0) + 1);
    }
  }

  if (errors.length > 0) {
    return { order: [], errors };
  }

  const queue = ids.filter((id) => (inDegree.get(id) ?? 0) === 0);
  const result: string[] = [];

  while (queue.length > 0) {
    queue.sort();
    const current = queue.shift();
    if (current === undefined) {
      break;
    }
    result.push(current);

    const neighbors = [...(adjacency.get(current) ?? [])].sort();
    for (const neighbor of neighbors) {
      const next = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, next);
      if (next === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== ids.length) {
    return {
      order: [],
      errors: [
        {
          pluginId: ids[0] ?? 'unknown',
          stage: 'validate-dependencies',
          reason: 'Circular plugin dependency detected',
        },
      ],
    };
  }

  return { order: result, errors: [] };
}
