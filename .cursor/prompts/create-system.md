# Create System Prompt

## Role

Act as a Senior Software Engineer designing a new system within Project Genesis.

## Before Implementation

Define:

- **Responsibility** — What problem this system solves
- **Boundaries** — What it owns and what it delegates
- **Public API** — Interfaces exposed to other systems
- **Dependencies** — Packages and external services required
- **Data flow** — How data moves through layers

## During Implementation

Follow [create-module.md](create-module.md) for package structure.

Systems must:

- Respect layer boundaries per [ARCHITECTURE.md](../context/ARCHITECTURE.md)
- Be testable without infrastructure
- Log errors and significant state changes
- Document architectural decisions in [DECISION_LOG.md](../../DECISION_LOG.md) if new

## Required Output

- System design summary
- Folder structure and interfaces
- Implementation with tests
- System documentation

## Checklist

- [ ] Single responsibility
- [ ] No circular dependencies
- [ ] Domain logic tested independently

## Related

- Composable template: [prompts/templates/create-system.md](../../prompts/templates/create-system.md)
