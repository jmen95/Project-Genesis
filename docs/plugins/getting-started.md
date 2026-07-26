# Genesis Plugins — Getting Started

Create a plugin with the Genesis Plugin SDK (`@genesis/plugin-sdk`).

You do **not** need to understand `@genesis/plugin-kernel` internals.

## 1. Scaffold

```bash
pnpm create genesis-plugin my-plugin --id @acme/my-plugin --name "My Plugin"
cd my-plugin
pnpm install
```

## 2. Implement

Edit `src/index.ts`:

```typescript
import { defineHook, definePlugin } from '@genesis/plugin-sdk';

export default definePlugin({
  id: '@acme/my-plugin',
  version: '0.1.0',
  description: 'My Plugin',
  genesisVersion: '^0.1.0',
  hooks: {
    afterProjectCreate: defineHook({
      id: 'ready',
      handler: ({ logger }) => logger.info('Ready'),
    }),
  },
});
```

Keep `genesis.plugin.json` in sync for `id`, `version`, and `genesisVersion`.

## 3. Build and load

```bash
pnpm build
export GENESIS_PLUGIN_PATH=$(pwd)
genesis plugin list
```

## 4. Test

```typescript
import { createPluginTestHarness } from '@genesis/plugin-sdk/testing';
```

See [testing.md](./testing.md).

## Next steps

- [define-plugin.md](./define-plugin.md) — API reference
- [versioning.md](./versioning.md) — compatibility matrix
- Reference plugin: `packages/plugins/example/`
