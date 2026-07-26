# Plugin Kernel (`@genesis/plugin-kernel`)

Runtime plugin loading for the Genesis framework.

## Audience

| API | Audience |
|-----|----------|
| **Framework API** (`@genesis/plugin-kernel`) | Genesis CLI and framework integrators |
| **Runtime Internal** (`@genesis/plugin-kernel/internal`) | `@genesis/plugin-sdk` adapter only |
| **Plugin authors** | Use [`@genesis/plugin-sdk`](../plugin-sdk/) — not this package |

## Framework API exports

- `PluginHost`, `createPluginHost`, `resolveDefaultPluginSearchPaths`
- `GenesisPlugin`, `PluginManifest`, `PluginState`, `PluginLoadError`
- `HookRunner`, `HookPoint`

## Runtime internal exports

`PluginContext`, `*Registration` types, and registry entries are internal.
They are exported via `@genesis/plugin-kernel/internal` for the SDK adapter.

Plugin authors must not import runtime internals.
