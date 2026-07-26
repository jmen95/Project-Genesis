---
id: GEN-CTX-TASK
title: Current Task
status: Active
version: 1.0.0
owner: Project Genesis
updated: 2026-07-26
---

# Current Task

## Active Task

**Bootstrap the Turborepo monorepo and create the initial package skeleton.**

## Context

Project Genesis has completed its documentation-first bootstrap (ADR-007). Governance documents, standards, knowledge base structure, Cursor AI operating system, and template libraries are in place. The next engineering deliverable is the runtime foundation defined in [ADR-005](../../DECISION_LOG.md#adr-005-turborepo-monorepo).

This task is the first item in [Sprint 1](CURRENT_SPRINT.md) and the primary deliverable of [Milestone M1](CURRENT_MILESTONE.md).

## Objective

Establish the monorepo infrastructure and create empty package skeletons so subsequent tasks can implement core services, CLI commands, and the template engine.

## Deliverables

| # | Deliverable | Package / Location | Acceptance |
|---|-------------|-------------------|------------|
| 1 | Root workspace configuration | `package.json`, `pnpm-workspace.yaml`, `turbo.json` | `pnpm install` succeeds |
| 2 | Shared tooling configuration | `biome.json`, `tsconfig.base.json`, `vitest.config.ts` | `pnpm format:check` and `pnpm test` run (empty suite passes) |
| 3 | Shared types package | `packages/shared` | Exports base types and constants; builds successfully |
| 4 | Core services package | `packages/core` | Package structure with domain/application/infrastructure folders; depends on `shared` |
| 5 | CLI package | `packages/cli` | Entry point with `--version` and `--help` commands; depends on `core` and `shared` |
| 6 | Package documentation | Each package `README.md` | Describes responsibility, public API intent, and dependencies |

## Out of Scope

The following are explicitly deferred to subsequent tasks within M1:

- Configuration loading implementation
- Structured logging implementation
- Filesystem service implementation
- Template engine rendering
- Scaffolding engine
- Plugin system
- CI/CD pipeline

## Dependencies

| Dependency | Status |
|------------|--------|
| Governance documentation | Complete |
| ADR-005 (Turborepo Monorepo) | Accepted |
| ADR-003 (TypeScript First) | Accepted |
| ADR-006 (Biome) | Accepted |
| TECH_STACK.md | Defined |

## Architectural Constraints

- Package dependency direction must follow [ARCHITECTURE.md](ARCHITECTURE.md)
- `packages/shared` has no internal package dependencies
- `packages/core` depends only on `packages/shared`
- `packages/cli` depends on `packages/core` and `packages/shared`
- No business logic in CLI presentation layer beyond argument parsing and output
- Strict TypeScript per [`.cursor/rules/03-typescript.mdc`](../rules/03-typescript.mdc)

## Implementation Guidance

Use [`.cursor/prompts/create-module.md`](../prompts/create-module.md) when creating each package. Follow [DEVELOPMENT_WORKFLOW.md](../../DEVELOPMENT_WORKFLOW.md) and verify against [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).

## Success Criteria

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` compiles all packages
- [ ] `pnpm test` passes (minimum smoke tests per package)
- [ ] `pnpm format:check` passes
- [ ] `genesis --version` prints a version string
- [ ] `genesis --help` prints available commands
- [ ] Package dependency graph matches ARCHITECTURE.md
- [ ] All deliverables meet Definition of Done

## After Completion

Update these documents:

1. [PROJECT_STATUS.md](../../PROJECT_STATUS.md) — Mark monorepo bootstrap as complete
2. [CURRENT_SPRINT.md](CURRENT_SPRINT.md) — Mark Sprint 1 tasks done; plan Sprint 2
3. [CURRENT_TASK.md](CURRENT_TASK.md) — Set next task: implement core services (config, logging, filesystem)
4. [`.cursor/memories/known-issues.md`](../memories/known-issues.md) — Update CLI status

## Related Documents

- [CURRENT_MILESTONE.md](CURRENT_MILESTONE.md) — Milestone M1 objectives
- [CURRENT_SPRINT.md](CURRENT_SPRINT.md) — Sprint 1 backlog
- [ARCHITECTURE.md](ARCHITECTURE.md) — Package layout
- [DECISION_LOG.md](../../DECISION_LOG.md) — ADR-005, ADR-003, ADR-006

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial task: monorepo bootstrap |
