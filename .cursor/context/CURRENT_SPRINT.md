---
id: GEN-CTX-SPRINT
title: Current Sprint
status: Active
version: 1.0.0
owner: Project Genesis
updated: 2026-07-26
---

# Current Sprint

## Sprint 1 — Monorepo Bootstrap

| Attribute | Value |
|-----------|-------|
| **Milestone** | M1 — Genesis CLI Foundation |
| **Status** | Active |
| **Start date** | 2026-07-28 |
| **End date** | 2026-08-10 |
| **Duration** | 2 weeks |

## Sprint Goal

Establish the Turborepo monorepo with pnpm workspaces, configure shared tooling (Biome, Vitest, TypeScript), and create package skeletons for `shared`, `core`, and `cli` with a minimal working CLI entry point.

## Sprint Backlog

| ID | Task | Priority | Status | Owner |
|----|------|----------|--------|-------|
| S1-01 | Create root `package.json` with workspace scripts | P0 | Pending | Engineering |
| S1-02 | Create `pnpm-workspace.yaml` targeting `packages/*` | P0 | Pending | Engineering |
| S1-03 | Create `turbo.json` with build, test, lint, and format tasks | P0 | Pending | Engineering |
| S1-04 | Configure `biome.json` at repository root | P0 | Pending | Engineering |
| S1-05 | Configure `tsconfig.base.json` and per-package tsconfig | P0 | Pending | Engineering |
| S1-06 | Configure `vitest.config.ts` at repository root | P1 | Pending | Engineering |
| S1-07 | Scaffold `packages/shared` with types and constants | P0 | Pending | Engineering |
| S1-08 | Scaffold `packages/core` with layer folder structure | P0 | Pending | Engineering |
| S1-09 | Scaffold `packages/cli` with entry point | P0 | Pending | Engineering |
| S1-10 | Implement `genesis --version` command | P0 | Pending | Engineering |
| S1-11 | Implement `genesis --help` command | P0 | Pending | Engineering |
| S1-12 | Write package README for each new package | P1 | Pending | Engineering |
| S1-13 | Add smoke tests for each package | P1 | Pending | Engineering |
| S1-14 | Verify full build pipeline (`install → build → test → format:check`) | P0 | Pending | Engineering |
| S1-15 | Update PROJECT_STATUS and sprint documentation | P1 | Pending | Architecture |

## Task Details

### S1-01 through S1-06 — Workspace Infrastructure

Create the monorepo foundation per [ADR-005](../../DECISION_LOG.md#adr-005-turborepo-monorepo) and [ADR-006](../../DECISION_LOG.md#adr-006-biome-for-code-quality).

**Acceptance criteria:**

- `pnpm install` resolves all workspace dependencies
- `pnpm build` compiles TypeScript across all packages
- `pnpm test` runs Vitest (empty or smoke tests pass)
- `pnpm format:check` reports no Biome violations
- Package naming follows `@genesis/<name>` convention

### S1-07 — packages/shared

Create the shared types package with no internal package dependencies.

**Contents:**

- Base type definitions used across packages
- Framework constants (version, package names)
- Shared utility functions with no side effects

**Acceptance criteria:**

- Package builds independently
- Exports are accessible via `@genesis/shared`
- At least one smoke test passes

### S1-08 — packages/core

Create the core services package depending only on `@genesis/shared`.

**Folder structure:**

```
packages/core/
├── src/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── package.json
├── tsconfig.json
└── README.md
```

**Acceptance criteria:**

- Layer folders exist per [standards/ARCHITECTURE_STANDARD.md](../../standards/ARCHITECTURE_STANDARD.md)
- Package builds with dependency on `@genesis/shared`
- README describes planned services (config, logging, filesystem)

### S1-09 through S1-11 — packages/cli

Create the CLI package depending on `@genesis/core` and `@genesis/shared`.

**Acceptance criteria:**

- `genesis --version` outputs the current version string
- `genesis --help` lists available commands and descriptions
- CLI entry point registered in `package.json` bin field
- Presentation layer contains no business logic

### S1-12 through S1-15 — Documentation and Validation

**Acceptance criteria:**

- Each package README describes responsibility, dependencies, and public API intent
- [PROJECT_STATUS.md](../../PROJECT_STATUS.md) reflects monorepo bootstrap completion
- [CURRENT_TASK.md](CURRENT_TASK.md) updated with next task
- All Sprint 1 tasks meet [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)

## Active Task

The current engineering focus is S1-01 through S1-14, consolidated as a single implementation unit. See [CURRENT_TASK.md](CURRENT_TASK.md).

## Dependencies

| Dependency | Status |
|------------|--------|
| Governance documentation complete | Done |
| ADR-005 accepted | Done |
| ADR-003 (TypeScript strict) | Done |
| ADR-006 (Biome) | Done |
| Node.js 22 available | Required |

## Blockers

No blockers.

## Out of Scope

| Item | Deferred To |
|------|-------------|
| Configuration loading | Sprint 2 |
| Structured logging | Sprint 2 |
| Filesystem service | Sprint 2 |
| Template engine | Sprint 3 |
| Scaffolding engine | Sprint 4 |
| CI/CD pipeline | Sprint 2 |
| Plugin system | Phase 2 |

## Daily Progress

| Date | Update |
|------|--------|
| 2026-07-26 | Sprint 1 planned. Governance documentation completed. Active task set to monorepo bootstrap. |

> Update this table daily during the sprint.

## Sprint Review Criteria

Sprint 1 is complete when:

- [ ] All P0 backlog items are done
- [ ] `pnpm install && pnpm build && pnpm test && pnpm format:check` succeeds
- [ ] `genesis --version` and `genesis --help` work
- [ ] Package dependency graph matches [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] All deliverables meet [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)
- [ ] PROJECT_STATUS and CURRENT_TASK updated

## Next Sprint Preview

**Sprint 2 — Core Services and CLI Framework** (2026-08-11 → 2026-08-24)

- Implement configuration loading service
- Implement structured logging service
- Implement filesystem utilities
- Expand CLI with command registration framework
- Add CI pipeline (build, test, lint)
- Unit tests for all core services

## Related Documents

- [CURRENT_MILESTONE.md](CURRENT_MILESTONE.md) — Milestone M1 objectives
- [CURRENT_TASK.md](CURRENT_TASK.md) — Active engineering task
- [ARCHITECTURE.md](ARCHITECTURE.md) — Package layout
- [TECH_STACK.md](TECH_STACK.md) — Tooling choices
- [DEVELOPMENT_WORKFLOW.md](../../DEVELOPMENT_WORKFLOW.md) — Implementation process

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Sprint 1 defined with 15 backlog items |
