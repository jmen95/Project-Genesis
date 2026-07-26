# Plugins

Technology plugins for Project Genesis. **Phase 2 — not yet implemented.**

## Planned Plugins

| Plugin | Path | Technology |
|--------|------|------------|
| Unity | [unity/](unity/) | Unity game engine |
| NestJS | [nestjs/](nestjs/) | Backend API framework |
| AWS | [aws/](aws/) | Amazon Web Services |
| Firebase | [firebase/](firebase/) | Google Firebase |

## Architecture

Plugins register with the kernel:

- Commands, templates, generators, validators, hooks

See [ADR-002](../../DECISION_LOG.md#adr-002-plugin-based-architecture).

## Constraints

Production plugins are out of scope during Phase 1. See [CURRENT_STATE.md](../../.cursor/context/CURRENT_STATE.md).

## Related

- [specs/003-plugin-system/FUNCTIONAL_SPEC.md](../../specs/003-plugin-system/FUNCTIONAL_SPEC.md) — Complete plugin system functional specification
- [specs/003-plugin-system/](../../specs/003-plugin-system/) — Plugin system specification overview
- [../README.md](../README.md) — Package map
