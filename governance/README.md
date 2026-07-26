---
id: GEN-GOV-0000
title: Governance Index
status: Approved
version: 1.0.0
owner: Project Genesis
---

# Governance

Project Genesis governance defines **how we decide, build, review, and ship** work. It complements mandatory technical rules in [`standards/`](../standards/) and strategic direction in [`docs/`](../docs/).

## Governance vs Standards

| Layer | Location | Question answered |
|-------|----------|-------------------|
| **Governance** | `governance/` | *How* do we make and deliver changes? |
| **Standards** | `standards/` | *What* must code and docs conform to? |
| **Specs** | `specs/` | *What* are we building? |
| **Decisions** | `DECISION_LOG.md` | *Why* did we choose this? |

When governance and standards conflict, escalate to maintainers. Standards win on technical rules; governance wins on process.

## Documents

### Principles and standards

| Document | Description |
|----------|-------------|
| [ENGINEERING_PRINCIPLES.md](ENGINEERING_PRINCIPLES.md) | Non-negotiable engineering values and decision heuristics |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | How coding standards are defined, enforced, and evolved |

### Review and decision processes

| Document | Description |
|----------|-------------|
| [ARCHITECTURE_REVIEW_PROCESS.md](ARCHITECTURE_REVIEW_PROCESS.md) | When and how architecture changes are reviewed |
| [PULL_REQUEST_PROCESS.md](PULL_REQUEST_PROCESS.md) | PR lifecycle from draft to merge |
| [ADR_PROCESS.md](ADR_PROCESS.md) | Architecture Decision Record workflow |
| [RFC_PROCESS.md](RFC_PROCESS.md) | Request for Comments for significant proposals |
| [SECURITY_REVIEW_PROCESS.md](SECURITY_REVIEW_PROCESS.md) | Security assessment before merge and release |
| [AI_CONTRIBUTION_POLICY.md](AI_CONTRIBUTION_POLICY.md) | Rules for AI-assisted and AI-generated contributions |
| [AI_COLLABORATION.md](AI_COLLABORATION.md) | Multi-AI assistant roles, conflict resolution, ownership |
| [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) | GitHub labels, milestones, projects, templates, releases, protection |

### Quality assurance

| Document | Description |
|----------|-------------|
| [specs/000-project/QUALITY_GATES.md](../specs/000-project/QUALITY_GATES.md) | Mandatory PR quality gate declarations (G1–G7) |

### Shipping and versioning

| Document | Description |
|----------|-------------|
| [VERSIONING_STRATEGY.md](VERSIONING_STRATEGY.md) | Semantic versioning for packages, plugins, and docs |
| [RELEASE_STRATEGY.md](RELEASE_STRATEGY.md) | Release cadence, channels, and promotion |
| [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) | Branch types, naming, and merge rules |

### Documentation

| Document | Description |
|----------|-------------|
| [DOCUMENTATION_POLICY.md](DOCUMENTATION_POLICY.md) | What to document, where it lives, and update triggers |

## Roles

| Role | Primary governance responsibilities |
|------|-------------------------------------|
| **Contributor** | Follow processes; self-review against DoD |
| **Reviewer** | PR review per [PULL_REQUEST_PROCESS.md](PULL_REQUEST_PROCESS.md) |
| **Maintainer** | Merge authority; RFC/ADR triage; release management |
| **Chief Architect** | Final call on architecture disputes; ADR approval |
| **Security steward** | Security review triage and sign-off |
| AI operator | Ensure AI contributions comply with [AI_CONTRIBUTION_POLICY.md](AI_CONTRIBUTION_POLICY.md) and [AI_COLLABORATION.md](AI_COLLABORATION.md) |

## Entry points

| Audience | Start here |
|----------|------------|
| New contributor | [CONTRIBUTING.md](../CONTRIBUTING.md) → [PULL_REQUEST_PROCESS.md](PULL_REQUEST_PROCESS.md) |
| Architect | [ADR_PROCESS.md](ADR_PROCESS.md) → [ARCHITECTURE_REVIEW_PROCESS.md](ARCHITECTURE_REVIEW_PROCESS.md) |
| Release manager | [VERSIONING_STRATEGY.md](VERSIONING_STRATEGY.md) → [RELEASE_STRATEGY.md](RELEASE_STRATEGY.md) |
| AI assistant | [AI_COLLABORATION.md](AI_COLLABORATION.md) → [AI_ARCHITECT.md](../AI_ARCHITECT.md) |

## Related documents

- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution onboarding
- [DEVELOPMENT_WORKFLOW.md](../DEVELOPMENT_WORKFLOW.md) — End-to-end development workflow
- [DECISION_LOG.md](../DECISION_LOG.md) — Canonical ADR record
- [docs/000-foundation/PROJECT_CHARTER.md](../docs/000-foundation/PROJECT_CHARTER.md) — Charter and definition of done
- [docs/000-foundation/LONG_TERM_VISION.md](../docs/000-foundation/LONG_TERM_VISION.md) — Five-year strategic north star
- [standards/README.md](../standards/README.md) — Mandatory engineering standards
- [.cursor/context/DEFINITION_OF_DONE.md](../.cursor/context/DEFINITION_OF_DONE.md) — Completion criteria

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial governance model |
