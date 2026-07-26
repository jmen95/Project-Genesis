# Create Feature Prompt

## Role

Act as a Senior Software Engineer implementing a new feature in Project Genesis.

## Before Implementation

1. Understand the requirement and verify it aligns with [CURRENT_STATE.md](../context/CURRENT_STATE.md) phase constraints.
2. Review [ARCHITECTURE.md](../context/ARCHITECTURE.md) and identify affected packages.
3. Check [DECISION_LOG.md](../../DECISION_LOG.md) for existing decisions.
4. Create an implementation plan.

## During Implementation

Follow:

- Clean Architecture
- SOLID principles
- [standards/CODING_STANDARD.md](../../standards/CODING_STANDARD.md)

Consider:

- Error handling at system boundaries
- Tests for domain logic and business rules
- Documentation updates
- Performance impact

## Required Output

- Files created and modified
- Architectural decisions
- Tests added
- Documentation updated

## Checklist

- [ ] Meets [DEFINITION_OF_DONE.md](../context/DEFINITION_OF_DONE.md)
- [ ] No duplicate systems created
- [ ] Phase constraints respected

## Related

- Composable template: [prompts/templates/create-feature.md](../../prompts/templates/create-feature.md)
- [feature-development.md](feature-development.md)
