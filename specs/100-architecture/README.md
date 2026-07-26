---
id: GEN-SPEC-100
title: Core Architecture Specification
status: Approved
version: 1.0.0
owner: Project Genesis
phase: 1
---

# Core Architecture Specification

## Purpose

Define the **runtime architecture** of Project Genesis — package boundaries, dependencies, public APIs, and evolution strategy for everything under `packages/`.

## Documents

| Document | Description |
|----------|-------------|
| [PACKAGES.md](PACKAGES.md) | **Package architecture** — every `@genesis/*` package: purpose, API, dependencies, structure, interfaces, lifecycle, testing, extension points |
| [KERNEL.md](KERNEL.md) | **Genesis Kernel** — boot, DI, registries, events, hooks, logging, shutdown, recovery, distributed execution |
| This document | Architecture spec index |

## Scope

- TypeScript monorepo packages (`packages/`)
- Plugin packages (`packages/plugins/*`)
- Dependency rules and layer assignments
- Public API contracts between packages

### Out of Scope

- `framework/` (game runtime — C#/Unity)
- `games/` (individual game projects)
- Implementation code

## Related

- [000-project/README.md](../000-project/README.md) — System-wide principles
- [003-plugin-system/FUNCTIONAL_SPEC.md](../003-plugin-system/FUNCTIONAL_SPEC.md) — Plugin kernel contract
- [CONFIGURATION.md](../001-cli/CONFIGURATION.md) — `genesis.config.ts` system
- [DECISION_LOG.md](../../DECISION_LOG.md) — ADR-001, ADR-002, ADR-005

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial architecture specification |
