# @genesis/plugin-example

Official reference plugin for the Genesis Plugin SDK.

## Dependencies

This plugin depends only on `@genesis/plugin-sdk`.

## Develop

```bash
pnpm build
pnpm test
```

From the monorepo root:

```bash
pnpm genesis plugin list
pnpm genesis plugin info @genesis/plugin-example
```

## Contributions

| Type | Id |
|------|-----|
| Template | `example-stub` |
| Validator | `EX-001` (`@genesis/plugin-example:EX-001` at runtime) |
| Hook | `afterProjectCreate` → `after-create` |

Capabilities are inferred automatically — do not add `capabilities` to `genesis.plugin.json`.
