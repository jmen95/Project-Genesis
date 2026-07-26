# Plugin Version Compatibility

## Version axes

| Artifact | Version |
|----------|---------|
| Genesis CLI / monorepo | Semver (e.g. `0.1.0`) |
| Plugin Kernel API | `PLUGIN_API_VERSION` |
| Plugin SDK | `SDK_API_VERSION` |
| Your plugin | `version` in `definePlugin` + `genesis.plugin.json` |

## Plugin compatibility

Set `genesisVersion` to the Genesis releases your plugin supports:

```json
{
  "genesisVersion": "^0.1.0"
}
```

Genesis validates this range before loading your plugin.

## SDK stability

The SDK is the stable authoring API. Kernel internals may change; the SDK adapter absorbs changes when possible.

## Deprecation policy

- SDK public helpers: deprecated ≥1 minor before removal
- Kernel author-facing exports: use SDK instead

## Matrix (initial)

| Genesis | SDK | Kernel API |
|---------|-----|------------|
| 0.1.x | 0.1.x | 1.0.x |

Update this matrix with each release.
