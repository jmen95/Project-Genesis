import { describe, expect, it } from 'vitest';

import { defineHook, definePlugin, defineTemplate, defineValidator } from './index.js';
import { createPluginTestHarness } from './testing/create-plugin-test-harness.js';

describe('definePlugin', () => {
  it('infers capabilities from contributions', () => {
    const definition = {
      id: '@genesis/test-plugin',
      version: '1.0.0',
      description: 'Test plugin',
      genesisVersion: '^0.1.0',
      templates: [defineTemplate({ id: 'starter', version: '1.0.0' })],
      validators: [
        defineValidator({
          id: 'VAL-001',
          kind: 'project-output' as const,
          validate: () => [],
        }),
      ],
      hooks: {
        afterProjectCreate: defineHook({
          id: 'log',
          handler: () => undefined,
        }),
      },
    };

    const plugin = definePlugin(definition);
    const harness = createPluginTestHarness({ plugin, definition });

    expect(harness.capabilities).toEqual(['hook', 'template', 'validator']);
    expect(plugin.manifest.capabilities).toEqual(['hook', 'template', 'validator']);
  });

  it('rejects plugins without contributions', () => {
    expect(() =>
      definePlugin({
        id: '@genesis/empty',
        version: '1.0.0',
        description: 'Empty',
        genesisVersion: '^0.1.0',
      }),
    ).toThrow(/at least one contribution/i);
  });
});

describe('plugin test harness', () => {
  const definition = {
    id: '@genesis/harness-test',
    version: '1.0.0',
    description: 'Harness test',
    genesisVersion: '^0.1.0',
    validators: [
      defineValidator({
        id: 'VAL-001',
        kind: 'project-output' as const,
        validate: (target) =>
          target.kind === 'project-output' && target.rootPath.includes('warn')
            ? [{ severity: 'warning' as const, message: 'warn path' }]
            : [],
      }),
    ],
    hooks: {
      beforeValidation: defineHook({
        id: 'noop',
        handler: () => undefined,
      }),
    },
  };

  const plugin = definePlugin(definition);
  const harness = createPluginTestHarness({ plugin, definition });

  it('runs validators in isolation', async () => {
    const issues = await harness.runValidator('project-output', '/tmp/warn-project');
    expect(issues).toHaveLength(1);
    expect(issues[0]?.severity).toBe('warning');
  });

  it('runs hooks in isolation', async () => {
    await expect(harness.runHook('beforeValidation', { path: '/tmp' })).resolves.toBeUndefined();
  });
});
