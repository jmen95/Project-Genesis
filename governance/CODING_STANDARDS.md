---
id: GEN-GOV-0002
title: Coding Standards
status: Approved
version: 1.0.0
owner: Project Genesis
---

# Coding Standards

## Purpose

Define how Project Genesis establishes, enforces, and evolves coding standards across the monorepo. This document governs the **standards lifecycle**; mandatory technical rules live in [`standards/`](../standards/).

## Responsibilities

| Role | Responsibility |
|------|----------------|
| **Contributors** | Write code that passes lint, format, and review against applicable standards |
| **Reviewers** | Verify standards compliance in every code PR |
| **Maintainers** | Approve new or changed standards; configure CI enforcement |
| **Standards owners** | Keep category standards in `standards/` current and non-contradictory |
| **AI assistants** | Follow [standards/](../standards/) and [`.cursor/rules/`](../.cursor/rules/) without exception |

## Standard hierarchy

```
governance/CODING_STANDARDS.md     ← how standards are managed (this document)
standards/CODING_STANDARD.md       ← authoritative general coding rules
standards/{category}/              ← domain-specific mandatory rules
.cursor/rules/*.mdc                ← AI-enforced behavior rules
knowledge/                         ← informative reference (not enforced)
```

When documents conflict:

1. ADR in [DECISION_LOG.md](../DECISION_LOG.md) wins for architectural choices
2. `standards/` wins over `knowledge/`
3. `.cursor/rules/` apply to AI sessions in addition to `standards/`

## Applicable standards by artifact

| Artifact | Primary standards |
|----------|-------------------|
| TypeScript packages | [CODING_STANDARD.md](../standards/CODING_STANDARD.md), [NAMING_STANDARD.md](../standards/NAMING_STANDARD.md), [`.cursor/rules/03-typescript.mdc`](../.cursor/rules/03-typescript.mdc) |
| CLI | [specs/001-cli/](../specs/001-cli/), [standards/ux/](../standards/ux/) |
| Plugins | [specs/003-plugin-system/](../specs/003-plugin-system/), [ARCHITECTURE_STANDARD.md](../standards/ARCHITECTURE_STANDARD.md) |
| Unity / C# | [standards/unity/](../standards/unity/) |
| Backend | [standards/backend/](../standards/backend/), [standards/api/](../standards/api/) |
| Tests | [standards/testing/](../standards/testing/), [`.cursor/rules/04-testing.mdc`](../.cursor/rules/04-testing.mdc) |
| AI code | [standards/ai/](../standards/ai/), [AI_CONTRIBUTION_POLICY.md](AI_CONTRIBUTION_POLICY.md) |

## Workflow

### Daily development

```mermaid
flowchart LR
    A[Identify change type] --> B[Read applicable standards]
    B --> C[Implement]
    C --> D[Run format and lint]
    D --> E[Self-review checklist]
    E --> F[Open PR]
    F --> G[Reviewer verifies standards]
```

### Proposing a new standard

1. Search `standards/` and `knowledge/` for existing coverage
2. Open an [RFC](RFC_PROCESS.md) if the change affects multiple packages or contributors
3. Draft the standard using [standards/DOCUMENTATION_STANDARD.md](../standards/DOCUMENTATION_STANDARD.md) structure
4. Record architectural impact in [DECISION_LOG.md](../DECISION_LOG.md) if needed
5. Maintainer approves and merges
6. Update [standards/README.md](../standards/README.md) index

### Enforcement

| Stage | Mechanism |
|-------|-----------|
| Local | `pnpm format`, `pnpm lint`, `pnpm test` (when monorepo is bootstrapped) |
| PR | Required reviewer approval; CI checks |
| Merge | [PULL_REQUEST_PROCESS.md](PULL_REQUEST_PROCESS.md) gates |
| Release | [RELEASE_STRATEGY.md](RELEASE_STRATEGY.md) quality bar |

## Examples

### TypeScript — compliant

```typescript
// packages/core/src/domain/plugin-id.ts
export type PluginId = string & { readonly __brand: unique symbol };

export function createPluginId(value: string): PluginId {
  if (!value.trim()) {
    throw new Error('PluginId cannot be empty');
  }
  return value as PluginId;
}
```

- Explicit return type on public function
- No `any`
- Domain validation at boundary

### TypeScript — non-compliant

```typescript
export function load(id: any) {
  return require('./' + id); // dynamic require, any, no validation
}
```

Violations: `any`, unsafe dynamic loading, no error handling, infrastructure mixed with API surface.

### Standard change — compliant process

1. Contributor opens RFC: "Adopt Biome as sole formatter"
2. RFC approved; ADR-00X recorded
3. `standards/coding/formatting.md` updated
4. CI updated in separate focused PR
5. [TECH_STACK.md](../.cursor/context/TECH_STACK.md) updated

## Best practices

- Match naming and structure of the file you are editing
- Prefer extending existing abstractions over new parallel utilities
- Run `genesis validate` (when available) before opening PRs for Genesis projects
- Flag standards gaps in PR comments rather than inventing local conventions
- Keep functions small; extract when a block needs a comment to explain *what* it does
- Use [`.cursor/prompts/create-module.md`](../.cursor/prompts/create-module.md) for new packages

## Related documents

- [standards/README.md](../standards/README.md)
- [standards/CODING_STANDARD.md](../standards/CODING_STANDARD.md)
- [standards/ARCHITECTURE_STANDARD.md](../standards/ARCHITECTURE_STANDARD.md)
- [standards/NAMING_STANDARD.md](../standards/NAMING_STANDARD.md)
- [ENGINEERING_PRINCIPLES.md](ENGINEERING_PRINCIPLES.md)
- [PULL_REQUEST_PROCESS.md](PULL_REQUEST_PROCESS.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial approved version |
