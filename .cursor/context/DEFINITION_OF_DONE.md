---
id: GEN-CTX-DOD
title: Definition of Done
status: Approved
version: 1.0.0
owner: Project Genesis
---

# Definition of Done

## Purpose

Define objective completion criteria for all work in Project Genesis. A task is not complete until every applicable criterion in this document is satisfied.

## Scope

Applies to features, bug fixes, documentation, standards, packages, plugins, and infrastructure work. The base criteria originate from [docs/000-foundation/PROJECT_CHARTER.md](../../docs/000-foundation/PROJECT_CHARTER.md) and are extended here with type-specific requirements.

## Universal Criteria

Every completed work item must satisfy all of the following:

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | **Requirement met** | Deliverable matches the stated objective in the task, sprint, or issue |
| 2 | **Architecture compliant** | Respects layer boundaries per [ARCHITECTURE.md](ARCHITECTURE.md) and [standards/ARCHITECTURE_STANDARD.md](../../standards/ARCHITECTURE_STANDARD.md) |
| 3 | **Standards followed** | Code, docs, and commits follow applicable `standards/` rules |
| 4 | **Tests pass** | All existing and new tests pass via `pnpm test` |
| 5 | **Formatter clean** | `pnpm format:check` passes with no violations |
| 6 | **Documentation updated** | Relevant docs, READMEs, and context files reflect the change |
| 7 | **No secrets exposed** | No credentials, API keys, or sensitive data in code or docs |
| 8 | **Review completed** | Pull request approved per [CONTRIBUTING.md](../../CONTRIBUTING.md); Quality Gates verified per [QUALITY_GATES.md](../../specs/000-project/QUALITY_GATES.md) |
| 9 | **Decision recorded** | New architectural decisions added to [DECISION_LOG.md](../../DECISION_LOG.md) |

> Criteria 4 and 5 apply once the monorepo is bootstrapped. During the documentation-only phase, they apply to markdown formatting and link validity.

## Criteria by Work Type

### Feature

| # | Criterion | Reference |
|---|-----------|-----------|
| F1 | Implementation plan was created and reviewed before coding | [DEVELOPMENT_WORKFLOW.md](../../DEVELOPMENT_WORKFLOW.md) |
| F2 | Domain logic has unit tests | [`.cursor/rules/04-testing.mdc`](../rules/04-testing.mdc) |
| F3 | Business rules have test coverage | [`.cursor/rules/04-testing.mdc`](../rules/04-testing.mdc) |
| F4 | Critical workflows have integration tests | `standards/testing/integration-tests.md` |
| F5 | Error handling at system boundaries | [`.cursor/rules/02-engineering.mdc`](../rules/02-engineering.mdc) |
| F6 | Logging at appropriate levels | `standards/logging/` |
| F7 | Performance impact considered | [`.cursor/rules/11-performance.mdc`](../rules/11-performance.mdc) |
| F8 | Phase constraints respected | [CURRENT_STATE.md](CURRENT_STATE.md) |

### Bug Fix

| # | Criterion | Reference |
|---|-----------|-----------|
| B1 | Root cause identified and documented in PR | [`.cursor/prompts/bug-fixing.md`](../prompts/bug-fixing.md) |
| B2 | Regression test added | [`.cursor/rules/04-testing.mdc`](../rules/04-testing.mdc) |
| B3 | Fix is minimal and focused | [`.cursor/rules/02-engineering.mdc`](../rules/02-engineering.mdc) |
| B4 | Related known issues updated if resolved | [`.cursor/memories/known-issues.md`](../memories/known-issues.md) |

### New Package or Module

| # | Criterion | Reference |
|---|-----------|-----------|
| M1 | Responsibility, public API, and dependencies defined before implementation | [`.cursor/prompts/create-module.md`](../prompts/create-module.md) |
| M2 | Folder structure follows layer conventions | [standards/ARCHITECTURE_STANDARD.md](../../standards/ARCHITECTURE_STANDARD.md) |
| M3 | Package README with purpose, API intent, and dependencies | [standards/DOCUMENTATION_STANDARD.md](../../standards/DOCUMENTATION_STANDARD.md) |
| M4 | Interfaces defined for cross-layer contracts | [`.cursor/rules/01-architecture.mdc`](../rules/01-architecture.mdc) |
| M5 | No circular dependencies | [standards/architecture/dependency-rule.md](../../standards/architecture/dependency-rule.md) |
| M6 | Architecture review completed | [`.cursor/prompts/architecture-review.md`](../prompts/architecture-review.md) |

### Documentation

| # | Criterion | Reference |
|---|-----------|-----------|
| D1 | Includes title, purpose, scope, and related documents | [standards/DOCUMENTATION_STANDARD.md](../../standards/DOCUMENTATION_STANDARD.md) |
| D2 | No TODOs or placeholder content | [standards/DOCUMENTATION_STANDARD.md](../../standards/DOCUMENTATION_STANDARD.md) |
| D3 | Cross-references existing docs instead of duplicating | [ADR-007](../../DECISION_LOG.md#adr-007-documentation-first-bootstrap) |
| D4 | Changelog entry for significant updates | This document |
| D5 | Understandable by senior engineers and AI assistants | [AI_ARCHITECT.md](../../AI_ARCHITECT.md) |

### Standard

| # | Criterion | Reference |
|---|-----------|-----------|
| S1 | Frontmatter with id, title, category, status, version, owner | Existing standards format |
| S2 | Includes purpose, scope, rules, best practices, anti-patterns, checklist | `standards/` convention |
| S3 | No overlap with existing standards | [standards/README.md](../../standards/README.md) |
| S4 | ADR recorded if the standard reflects an architectural decision | [DECISION_LOG.md](../../DECISION_LOG.md) |

### AI Feature

| # | Criterion | Reference |
|---|-----------|-----------|
| A1 | Input and output contracts defined | [`.cursor/rules/06-ai-development.mdc`](../rules/06-ai-development.mdc) |
| A2 | Failure scenarios documented | [`.cursor/rules/06-ai-development.mdc`](../rules/06-ai-development.mdc) |
| A3 | Evaluation criteria defined | [`.cursor/rules/06-ai-development.mdc`](../rules/06-ai-development.mdc) |
| A4 | Guardrails implemented | `standards/ai/guardrails.md` |
| A5 | Prompts versioned and reviewed | [ADR-004](../../DECISION_LOG.md#adr-004-ai-native-development) |
| A6 | No secrets or private data in prompts or context | [`.cursor/rules/10-security.mdc`](../rules/10-security.mdc) |

### Plugin

| # | Criterion | Reference |
|---|-----------|-----------|
| P1 | Implements the plugin contract (when defined) | [ADR-002](../../DECISION_LOG.md#adr-002-plugin-based-architecture) |
| P2 | Registers only declared capabilities | [ADR-002](../../DECISION_LOG.md#adr-002-plugin-based-architecture) |
| P3 | No direct dependency on other plugins | [ADR-002](../../DECISION_LOG.md#adr-002-plugin-based-architecture) |
| P4 | Lifecycle hooks handled correctly | Plugin contract documentation |
| P5 | Integration tests for plugin registration | `standards/testing/` |

> Plugin criteria apply from Phase 2 onward.

## Verification Checklist

Use this checklist before marking any task complete:

```
Universal:
[ ] Requirement met
[ ] Architecture compliant
[ ] Standards followed
[ ] Tests pass
[ ] Formatter clean
[ ] Documentation updated
[ ] No secrets exposed
[ ] Review completed
[ ] Decision recorded (if applicable)

Type-specific:
[ ] All criteria for the work type satisfied
```

Full checklist: [`.cursor/CURSOR_CHECKLIST.md`](../CURSOR_CHECKLIST.md).

## What "Done" Does Not Mean

- **Done ≠ merged to main** — Merged is a delivery step; done means all criteria are met before merge
- **Done ≠ deployed** — Deployment is a separate release workflow
- **Done ≠ perfect** — Done means meets criteria; improvements are tracked as technical debt in [`.cursor/memories/technical-debt.md`](../memories/technical-debt.md)

## Related Documents

- [docs/000-foundation/PROJECT_CHARTER.md](../../docs/000-foundation/PROJECT_CHARTER.md) — Base definition of done
- [DEVELOPMENT_WORKFLOW.md](../../DEVELOPMENT_WORKFLOW.md) — When to verify DoD
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — PR requirements
- [specs/000-project/QUALITY_GATES.md](../../specs/000-project/QUALITY_GATES.md) — PR quality gate declarations
- [AI_ARCHITECT.md](../../AI_ARCHITECT.md) — AI output expectations

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial approved version with universal and type-specific criteria |
