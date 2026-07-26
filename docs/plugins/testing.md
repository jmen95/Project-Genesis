# Plugin Testing

Use `@genesis/plugin-sdk/testing` for unit-level plugin tests.

## Harness

```typescript
import { describe, expect, it } from 'vitest';
import { createPluginTestHarness } from '@genesis/plugin-sdk/testing';
import plugin from '../src/index.js';

const definition = { /* mirror your definePlugin fields */ };

describe('my-plugin', () => {
  const harness = createPluginTestHarness({ plugin, definition });

  it('infers capabilities', () => {
    expect(harness.capabilities).toContain('hook');
  });

  it('runs validators', async () => {
    const issues = await harness.runValidator('project-output', '/tmp/project');
    expect(issues).toHaveLength(0);
  });
});
```

## Scope

The harness validates definitions and runs validators/hooks in isolation.

It does **not** simulate the full CLI runtime. Use integration tests with `GENESIS_PLUGIN_PATH` for end-to-end verification:

```bash
export GENESIS_PLUGIN_PATH=/path/to/plugin
genesis plugin list
```

## Rationale

Keeping the testing package small avoids maintaining a duplicate CLI runtime in the SDK.
