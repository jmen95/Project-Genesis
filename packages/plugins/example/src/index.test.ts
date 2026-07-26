import { describe, expect, it } from 'vitest';

import { createPluginTestHarness } from '@genesis/plugin-sdk/testing';

import plugin from '../src/index.js';

describe('@genesis/plugin-example', () => {
  const harness = createPluginTestHarness({ plugin });

  it('registers expected contributions', () => {
    expect(harness.templateIds).toEqual(['example-stub']);
    expect(harness.validatorIds).toEqual(['@genesis/plugin-example:EX-001']);
    expect(harness.capabilities).toEqual(['hook', 'template', 'validator']);
  });

  it('validator returns warning for fixture path', async () => {
    const issues = await harness.runValidator('project-output', '/tmp/skip-example-rule');
    expect(issues).toHaveLength(1);
    expect(issues[0]?.severity).toBe('warning');
  });
});
