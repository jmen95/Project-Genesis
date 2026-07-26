# Tests

Repository-level integration and end-to-end tests for Project Genesis.

## Structure

| Directory | Purpose |
|-----------|---------|
| [unit/](unit/) | Cross-package unit tests |
| [integration/](integration/) | Package integration tests |
| [e2e/](e2e/) | End-to-end CLI and workflow tests |

Package-level unit tests live alongside each package in `packages/<name>/`.

## Status

Scaffolded — test configuration will be added during Sprint 1 (Vitest).

## Related

- [standards/testing/](../standards/testing/) — Testing standards
- [`.cursor/rules/04-testing.mdc`](../.cursor/rules/04-testing.mdc) — Test priorities
