# definePlugin

`definePlugin()` is the single entry point for Genesis plugins.

## Signature

```typescript
function definePlugin(definition: PluginDefinition): GenesisPlugin
```

Export the result as the **default export** from your plugin entry module.

## Required fields

| Field | Description |
|-------|-------------|
| `id` | Plugin id (`@scope/name`) — must match `genesis.plugin.json` `name` |
| `version` | Semver — must match `genesis.plugin.json` `version` |
| `description` | Human-readable summary |
| `genesisVersion` | Supported Genesis range — must match `genesis.plugin.json` |

## Contributions

Declare at least one of:

- `templates` — `defineTemplate()`
- `validators` — `defineValidator()`
- `hooks` — `defineHook()` or inline handlers
- `commands` — `defineCommand()` (CLI binding Sprint 5.5)

Capabilities are **inferred** — never set `capabilities` manually.

## Lifecycle

| Hook | When |
|------|------|
| `setup` | After manifest validation, before registration |
| `teardown` | Optional unload |

## Rationale

`definePlugin()` adapts declarative definitions into kernel registrations internally.
Authors never call `registerTemplate()` or access `PluginContext`.
