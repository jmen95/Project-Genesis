import { describe, expect, it } from 'vitest';

import { GENESIS_PROJECT_CONFIG_SCHEMA_VERSION } from '../domain/genesis-project-config.js';
import { parseGenesisConfigSource } from './parse-genesis-config-source.js';
import { serializeGenesisConfig } from './serialize-genesis-config.js';

const sampleConfig = {
  schemaVersion: GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
  project: {
    name: 'ocean-quest',
    version: '0.1.0',
    type: 'game' as const,
    author: 'Project Genesis',
    license: 'MIT',
  },
  engine: { target: 'unity' as const },
  platforms: { targets: ['mobile' as const], primary: 'mobile' as const },
  modules: { enabled: ['assets', 'scripts', 'tests', 'docs'] },
  assets: { root: 'Assets' },
  scripts: { root: 'Scripts', language: 'csharp' as const },
  genesis: {
    version: '0.3.0',
    template: 'default',
    createdAt: '2026-07-26T12:00:00.000Z',
  },
};

describe('serializeGenesisConfig', () => {
  it('produces self-contained source without framework imports', () => {
    const source = serializeGenesisConfig(sampleConfig);
    expect(source).toContain('export default');
    expect(source).not.toContain('@genesis/config');
    expect(source).toContain("name: 'ocean-quest'");
  });

  it('round-trips through parseGenesisConfigSource', () => {
    const source = serializeGenesisConfig(sampleConfig);
    const parsed = parseGenesisConfigSource(source);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.project.name).toBe('ocean-quest');
    }
  });
});
