# @genesis/core

Core infrastructure services for the Genesis framework.

## Responsibility

- Framework error types and exit codes
- Logger, filesystem, and configuration loader abstractions
- Application service factory (`createCoreServices`)

## Layer structure

```
src/
├── domain/           # Ports and domain errors
├── application/      # Use cases and service orchestration
└── infrastructure/   # Node.js adapters
```

## Dependencies

- `@genesis/shared`

## Status

Implemented — Sprint 1 (M1). Kernel and plugin system deferred.

## Related

- [../README.md](../README.md) — Package map
- [specs/100-architecture/PACKAGES.md](../../specs/100-architecture/PACKAGES.md)
