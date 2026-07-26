# Create Tests Prompt

## Role

Act as a Senior Test Engineer writing tests for Project Genesis.

## Before Writing Tests

1. Identify what to test based on [`.cursor/rules/04-testing.mdc`](../rules/04-testing.mdc) priorities:
   - Domain logic
   - Business rules
   - Critical workflows
2. Review [standards/testing/](../../standards/testing/) for conventions.

## Test Requirements

Tests must be:

- **Deterministic** — Same input always produces same result
- **Readable** — Clear arrange/act/assert structure
- **Independent** — No test depends on another test's state
- **Focused** — One behavior per test

## Avoid

- Testing implementation details
- Fragile mocks that break on refactoring
- Random data without seed control

## Required Output

- Unit tests for domain logic
- Integration tests for critical workflows (when applicable)
- Edge case and error scenario coverage

## Checklist

- [ ] Domain logic has unit tests
- [ ] Error paths tested
- [ ] Tests pass with `pnpm test`

## Related

- Composable template: [prompts/templates/write-tests.md](../../prompts/templates/write-tests.md)
