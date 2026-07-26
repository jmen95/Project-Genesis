# Genesis Plugin SDK (`@genesis/plugin-sdk`)

Public authoring surface for Genesis plugins.

Third-party developers should depend on this package only — not `@genesis/plugin-kernel`.

## Quick start

```bash
pnpm create genesis-plugin my-plugin --id @acme/my-plugin
cd my-plugin
pnpm install
pnpm build
```

```typescript
import { defineHook, definePlugin } from '@genesis/plugin-sdk';

export default definePlugin({
  id: '@acme/my-plugin',
  version: '0.1.0',
  description: 'My plugin',
  genesisVersion: '^0.1.0',
  hooks: {
    afterProjectCreate: defineHook({
      id: 'ready',
      handler: ({ logger }) => logger.info('Project created'),
    }),
  },
});
```

## Public API

| Export | Purpose |
|--------|---------|
| `definePlugin()` | Declarative plugin entry point |
| `defineTemplate()` | Template contribution |
| `defineValidator()` | Validation rule contribution |
| `defineHook()` | Lifecycle hook contribution |
| `defineCommand()` | CLI command contribution (binding deferred) |

## Dual manifest

- `genesis.plugin.json` — discovery artifact (read before import)
- `definePlugin()` — source of truth after load

The SDK validates `id`, `version`, and `genesisVersion` match during `onLoad`.

## Capabilities

Inferred from contributions. Do **not** add `capabilities` to `genesis.plugin.json`.

## Testing

```typescript
import { createPluginTestHarness } from '@genesis/plugin-sdk/testing';
```

See [docs/plugins/testing.md](../../docs/plugins/testing.md).

## Reference

Official example: [`@genesis/plugin-example`](../plugins/example/)
