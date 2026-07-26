# Packages

TypeScript monorepo packages for the Genesis CLI and framework.

## Package map

| Package | Status | Responsibility |
|---------|--------|----------------|
| [shared/](shared/) | **Implemented** | Types, constants, pure utilities |
| [core/](core/) | **Implemented** | Errors, logging, filesystem, config loader |
| [cli/](cli/) | **Implemented** | CLI (`genesis` executable) |
| [templates/](templates/) | Scaffold | Project templates (Sprint 3+) |
| [plugins/](plugins/) | Scaffold | Technology plugins (Phase 2) |
| [ai/](ai/) | Planned | AI context and prompt management |
| [generators/](generators/) | Legacy scaffold | Will align to `scaffolding` |
| [validator/](validator/) | Planned | Architecture validation |

## Dependency rules

```
cli → core → shared
```

## Related

- [specs/](../specs/) — Formal specifications
- [TECH_STACK.md](../.cursor/context/TECH_STACK.md) — Node.js 22, pnpm, Turborepo
