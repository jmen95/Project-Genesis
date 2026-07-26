# Architecture Summary

Quick reference for Project Genesis system architecture. For full details, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Layers

```
Presentation → Application → Domain → Infrastructure
```

Dependencies point inward. Domain logic never depends on frameworks.

## Runtime Flow

```
CLI → Kernel → Services → Plugins → Generators → Templates
```

## Core Packages

| Package | Responsibility |
|---------|----------------|
| `packages/cli` | Commands and CLI lifecycle |
| `packages/core` | Config, logging, filesystem |
| `packages/shared` | Types, constants, utilities |
| `packages/ai` | AI context and prompt management |

## Planned Packages

| Package | Responsibility | Sprint |
|---------|----------------|--------|
| `packages/template-engine` | Template rendering | Sprint 3 |
| `packages/scaffolding` | Project generation | Sprint 4 |

## Scaffold Packages

The repository contains additional scaffold directories (`generators`, `validator`, `plugins`, `templates`) that will be aligned with the documented architecture during [Milestone M1](CURRENT_MILESTONE.md). See [packages/README.md](../../packages/README.md).

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Full architecture
- [../../DECISION_LOG.md](../../DECISION_LOG.md) — ADR-001, ADR-002
- [../../standards/ARCHITECTURE_STANDARD.md](../../standards/ARCHITECTURE_STANDARD.md) — Layer rules
