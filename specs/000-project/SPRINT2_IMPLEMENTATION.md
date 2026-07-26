# Sprint 2 Implementation Plan — `genesis new <project-name>`

**Status:** Approved — architectural adjustments applied.

---

## Objective

Scaffold a new project from a default template with variable rendering, dry-run, force overwrite, and project-name validation.

## Layer flow

```
CLI (presentation)
  → Command Handler
    → Application (use case)
      → Scaffolding (orchestration)
        → Template Engine (rendering + context)
          → Filesystem (@genesis/core)
```

The CLI must **never** read or write project files directly.

## Architectural adjustments (approved)

| # | Change | Rationale |
|---|--------|-----------|
| 1 | `ITemplateRenderer` abstraction | Template engine depends on interface; Handlebars only in infrastructure |
| 2 | `ITemplateProvider` abstraction | Scaffolding never accesses filesystem for template discovery |
| 3 | `ContextAssembler` in template-engine | Rendering context belongs to template rendering |
| 4 | Command Handler between Commander and Use Case | Keeps Commander isolated from application layer |
| 5 | `genesis.template.json` manifest | Renamed from `template.json` |
| 6 | Extended `GenerationPlanItem` | Optional `checksum`, `encoding`, `overwritePolicy`, `permissions` |

## Command contract

| Input | Behavior |
|-------|----------|
| `genesis new <project-name>` | Scaffold at `./<project-name>` |
| `--template <id>` | Template id (default: `default`) |
| `--output <path>` | Output root (default: `./<project-name>`) |
| `--dry-run` | Print plan only; no writes |
| `--force` | Overwrite non-empty output directory |

| Exit code | When |
|-----------|------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid project name / args |
| `3` | Output conflict |

## Acceptance criteria

| # | Criterion |
|---|-----------|
| AC1 | `pnpm build`, `pnpm lint`, `pnpm test` pass |
| AC2 | `genesis new my-game --dry-run` prints plan, writes nothing |
| AC3 | `genesis new my-game` creates README, genesis.config.ts, .gitignore, docs/, Assets/, Scripts/, Tests/ |
| AC4 | Rendered files contain `my-game` / `MyGame` where templated |
| AC5 | Invalid name (e.g. `My-Game`) → exit 2 |
| AC6 | Non-empty dir without `--force` → exit 3 |
| AC7 | `--force` overwrites existing files |
| AC8 | CLI handlers do not import `node:fs` |
| AC9 | Dependency direction: `cli → scaffolding → template-engine → core → shared` |
| AC10 | CI smoke: `genesis new smoke-test --dry-run` |
