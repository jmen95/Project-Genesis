import {
  GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
  type GenesisProjectConfig,
  type PlatformTarget,
} from '../domain/genesis-project-config.js';

export interface BuildGenesisProjectConfigInput {
  readonly projectName: string;
  readonly genesisVersion: string;
  readonly templateName: string;
  readonly author?: string;
  readonly license?: string;
  readonly createdAt?: string;
  readonly engineTarget?: 'unity' | 'generic';
  readonly platformTargets?: readonly PlatformTarget[];
}

export function buildGenesisProjectConfig(
  input: BuildGenesisProjectConfigInput,
): GenesisProjectConfig {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const platformTargets = input.platformTargets ?? ['mobile'];

  return {
    schemaVersion: GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
    project: {
      name: input.projectName,
      version: '0.1.0',
      type: 'game',
      ...(input.author !== undefined ? { author: input.author } : { author: 'Project Genesis' }),
      ...(input.license !== undefined ? { license: input.license } : { license: 'MIT' }),
    },
    engine: {
      target: input.engineTarget ?? 'unity',
    },
    platforms: {
      targets: platformTargets,
      ...(platformTargets[0] !== undefined ? { primary: platformTargets[0] } : {}),
    },
    modules: {
      enabled: ['assets', 'scripts', 'tests', 'docs'],
    },
    assets: { root: 'Assets' },
    scripts: { root: 'Scripts', language: 'csharp' },
    genesis: {
      version: input.genesisVersion,
      template: input.templateName,
      createdAt,
    },
  };
}
