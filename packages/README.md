# Packages

TypeScript monorepo packages for the Genesis CLI and framework.

## Package Map

| Package | Status | Responsibility |
|---------|--------|----------------|
| [shared/](shared/) | Scaffold | Types, constants, utilities |
| [core/](core/) | Scaffold | Config, logging, filesystem |
| [cli/](cli/) | Scaffold | CLI commands and lifecycle |
| [ai/](ai/) | Scaffold | AI context and prompt management |
| [generators/](generators/) | Scaffold | Code and project generators |
| [validator/](validator/) | Scaffold | Architecture and standards validation |
| [templates/](templates/) | Scaffold | Runtime template assets |
| [plugins/](plugins/) | Planned (Phase 2) | Technology plugins |

## Planned Packages (per ARCHITECTURE.md)

These packages are documented in [ARCHITECTURE.md](../.cursor/context/ARCHITECTURE.md) and will be created or renamed during Milestone M1:

| Documented Name | Current Scaffold | Action |
|-----------------|------------------|--------|
| `packages/scaffolding` | `packages/generators` | Align during Sprint 3–4 |
| `packages/template-engine` | `packages/templates` + `packages/generators` | Align during Sprint 3 |

## Dependency Rules

```
cli → core → shared
ai → core → shared
generators → core → shared
validator → core → shared
```

See [ARCHITECTURE.md](../.cursor/context/ARCHITECTURE.md) and [DECISION_LOG.md](../DECISION_LOG.md).

## Related

- [specs/](../specs/) — Formal architecture specifications
- [CURRENT_TASK.md](../.cursor/context/CURRENT_TASK.md) — Active engineering task
- [TECH_STACK.md](../.cursor/context/TECH_STACK.md) — Node.js 22, pnpm, Turborepo
