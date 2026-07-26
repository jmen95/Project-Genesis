
# Architectural Decisions Record

> **Canonical source:** [DECISION_LOG.md](../../DECISION_LOG.md) contains the full decision log (ADR-001 through ADR-008). This file is a Cursor context mirror with abbreviated summaries. Always prefer `DECISION_LOG.md` for the authoritative record.

This document stores important architectural decisions.

Format:

## Decision

## Context

## Choice

## Reason

## Consequences



---

# ADR-001: Clean Architecture

## Decision

Use Clean Architecture as the main architectural approach.


## Context

Project Genesis needs to scale for many plugins,
generators and integrations.


## Choice

Separate:

- Domain
- Application
- Infrastructure
- Presentation


## Reason

This allows:

- Maintainability
- Testing
- Replaceable infrastructure


## Consequences

Developers must respect dependency direction.



---

# ADR-002: Plugin-Based Architecture

## Decision

Project Genesis will use a plugin architecture.


## Context

The framework needs support for:

- Unity
- Unreal
- Backend systems
- AI integrations


## Choice

Plugins can register:

- Commands
- Templates
- Generators
- Validators
- Hooks


## Reason

Avoid coupling the core framework with specific technologies.


## Consequences

The core system must remain independent.



---

# ADR-003: TypeScript First

## Decision

Use TypeScript as the main implementation language.


## Context

The project requires:

- CLI development
- Tooling
- AI integrations
- Backend generation


## Choice

Node.js 22 + TypeScript.


## Reason

Provides:

- Strong typing
- Large ecosystem
- Developer productivity


## Consequences

All packages must follow strict TypeScript rules.



---

# ADR-004: AI-Native Development

## Decision

AI is a first-class capability of Project Genesis.


## Context

The objective is not only code generation,
but intelligent development workflows.


## Choice

Create:

- AI context system
- Prompt management
- Future agent architecture


## Consequences

AI features must include:

- Evaluation
- Security
- Observability

