# Create Backend Prompt

## Role

Act as a Senior Backend Engineer scaffolding a backend module in Project Genesis.

## Before Implementation

1. Review [ARCHITECTURE.md](../context/ARCHITECTURE.md) and [DECISION_LOG.md](../../DECISION_LOG.md).
2. Check [standards/backend/](../../standards/backend/) for DDD, CQRS, and event-driven patterns.
3. Define module responsibility, public API, and dependencies.
4. Create an implementation plan.

## During Implementation

Required structure per layer:

- **Domain** — Entities, value objects, domain services
- **Application** — Use cases, DTOs, interfaces
- **Infrastructure** — Repositories, external service adapters
- **Presentation** — Controllers, request/response mapping

## Required Output

- Folder structure
- Interfaces for cross-layer contracts
- Implementation with error handling
- Unit tests for domain logic
- Integration tests for critical workflows
- Module README

## Checklist

- [ ] Dependencies point inward
- [ ] No business logic in controllers
- [ ] Database access isolated in infrastructure
- [ ] Logging at appropriate levels

## Related

- Composable template: [prompts/templates/create-backend.md](../../prompts/templates/create-backend.md)
- [create-module.md](create-module.md)
