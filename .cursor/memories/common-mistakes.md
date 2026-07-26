# Common Mistakes

Mistakes to avoid when working on Project Genesis. Updated as patterns emerge.

## Engineering

- **Implementing before reading architecture** — Always read [ARCHITECTURE.md](../context/ARCHITECTURE.md) and [DECISION_LOG.md](../../DECISION_LOG.md) first.
- **Creating duplicate systems** — Search for existing abstractions before adding new ones.
- **Skipping tests for domain logic** — Domain and business rules require unit tests per [DEFINITION_OF_DONE.md](../context/DEFINITION_OF_DONE.md).

## Documentation

- **Duplicating content across files** — Cross-reference canonical sources instead of copying.
- **Leaving stub context files stale** — Update [CURRENT_TASK.md](../context/CURRENT_TASK.md) and [PROJECT_STATUS.md](../../PROJECT_STATUS.md) when deliverables change.

## AI Development

- **Blindly implementing without a plan** — Present an implementation plan when requirements are ambiguous.
- **Treating approved stub standards as enforced rules** — Only [top-level standards](../../standards/) and completed nested standards are authoritative.

## Related

- [lessons-learned.md](lessons-learned.md) — Formal lessons
- [known-issues.md](known-issues.md) — Known system limitations
