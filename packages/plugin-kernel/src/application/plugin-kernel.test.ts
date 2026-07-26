import { describe, expect, it } from 'vitest';

import { RegistryError } from '../domain/errors/registry.errors.js';
import { resolveDependencyOrder, validatePluginManifest } from './dependency-resolver.js';
import { InternalRegistry } from './internal-registries.js';
import { validatePluginId } from './manifest-validator.js';

describe('plugin-kernel registries', () => {
  it('rejects duplicate registration ids', () => {
    const registry = new InternalRegistry<{ value: string }>('template');
    const options = {
      pluginId: '@genesis/plugin-a',
      pluginVersion: '1.0.0',
      loadOrder: 0,
      capabilities: ['template'] as const,
    };

    registry.register('dup', { value: 'a' }, options);
    expect(() => registry.register('dup', { value: 'b' }, options)).toThrow(RegistryError);
  });

  it('sorts entries deterministically by priority then id', () => {
    const registry = new InternalRegistry<{ value: string }>('hook');
    const base = {
      pluginVersion: '1.0.0',
      loadOrder: 0,
      capabilities: ['hook'] as const,
    };

    registry.register('z-hook', { value: 'z' }, { ...base, pluginId: '@genesis/a', priority: 100 });
    registry.register('a-hook', { value: 'a' }, { ...base, pluginId: '@genesis/b', priority: 50 });

    expect(registry.list().map((entry) => entry.id)).toEqual(['a-hook', 'z-hook']);
  });
});

describe('manifest validation', () => {
  it('validates plugin id format', () => {
    expect(validatePluginId('@genesis/plugin-example')).toBeUndefined();
    expect(validatePluginId('invalid')).toBeDefined();
  });

  it('rejects incompatible genesis version before import', () => {
    const result = validatePluginManifest(
      {
        name: '@genesis/plugin-example',
        version: '1.0.0',
        apiVersion: '1.x',
        genesisVersion: '^99.0.0',
        description: 'test',
        main: './dist/index.js',
        capabilities: ['hook'],
      },
      '0.1.0',
      '@genesis/plugin-example',
    );

    expect(result.ok).toBe(false);
    expect(result.errors[0]?.stage).toBe('validate-genesis-version');
  });
});

describe('dependency resolver', () => {
  it('detects circular dependencies', () => {
    const manifests = new Map([
      [
        '@genesis/a',
        {
          name: '@genesis/a',
          version: '1.0.0',
          apiVersion: '1.x',
          genesisVersion: '^0.1.0',
          description: 'a',
          main: './index.js',
          capabilities: ['hook'] as const,
          dependencies: { '@genesis/b': '^1.0.0' },
        },
      ],
      [
        '@genesis/b',
        {
          name: '@genesis/b',
          version: '1.0.0',
          apiVersion: '1.x',
          genesisVersion: '^0.1.0',
          description: 'b',
          main: './index.js',
          capabilities: ['hook'] as const,
          dependencies: { '@genesis/a': '^1.0.0' },
        },
      ],
    ]);

    const { errors } = resolveDependencyOrder(manifests);
    expect(errors[0]?.stage).toBe('validate-dependencies');
  });
});
