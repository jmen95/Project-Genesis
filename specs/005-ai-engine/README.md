---
id: GEN-SPEC-005
title: AI Engine Specification
status: Approved
version: 1.0.0
owner: Project Genesis
phase: 4
package: "@genesis/ai"
---

# AI Engine Specification

## Purpose

Define the AI engine that provides context assembly, prompt management, LLM integration, and autonomous agent capabilities for Project Genesis. The AI engine serves both the framework's own development workflows and AI-assisted features within generated game projects.

## Documents

| Document | Description |
|----------|-------------|
| [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md) | **Complete functional specification** — architecture, context, prompts, RAG, agents, guardrails, providers, observability, security |
| This document | Overview, responsibilities, and implementation roadmap |

## Scope

### In Scope

- Project context assembly for LLM prompts
- Prompt loading, versioning, and composition
- LLM provider abstraction (OpenAI, Anthropic, local models)
- Agent architecture for planning, review, and generation tasks
- Guardrails: input validation, output filtering, cost controls
- Evaluation and observability for AI operations

### Out of Scope

- Cursor IDE integration (owned by `.cursor/` AI operating system)
- Composable prompt blocks in `prompts/` directory (authoring assets, not runtime)
- In-game AI features (NPC dialogue, procedural content — game-level concern)
- Model training or fine-tuning
- Vector database implementation (consumes external service)

## Goals

| Goal | Success Criteria |
|------|------------------|
| **Context-aware** | AI operations receive complete, relevant project context |
| **Provider-agnostic** | Switch LLM providers without changing application code |
| **Safe** | No secrets in prompts; output validated before use |
| **Observable** | Every AI call logged with cost, latency, and token count |
| **Evaluated** | AI outputs pass quality checks before delivery |
| **Cost-controlled** | Token budgets enforced per operation and per session |

## Responsibilities

### Architecture

```mermaid
flowchart TB
    CLI[CLI / Agents] --> AI[@genesis/ai]
    AI --> CM[Context Manager]
    AI --> PM[Prompt Manager]
    AI --> PA[Provider Adapter]
    AI --> GR[Guardrails]
    AI --> EV[Evaluator]
    CM --> CTX[Project Context]
    PM --> PB[Prompt Blocks]
    PM --> PT[Prompt Templates]
    PA --> OAI[OpenAI]
    PA --> ANT[Anthropic]
    PA --> LOCAL[Local Models]
    GR --> VAL[Input Validator]
    GR --> FIL[Output Filter]
```

### Core Components

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| `ContextManager` | Application | Assemble project context from files, specs, and memories |
| `PromptManager` | Application | Load, version, compose prompts from `prompts/` assets |
| `ProviderAdapter` | Infrastructure | Abstract LLM API calls behind uniform interface |
| `GuardrailEngine` | Domain | Validate inputs, filter outputs, enforce policies |
| `Evaluator` | Domain | Score AI output quality against criteria |
| `AgentOrchestrator` | Application | Coordinate multi-step agent workflows |
| `CostTracker` | Infrastructure | Track token usage and enforce budgets |

### Context Assembly

The `ContextManager` builds context for AI operations by reading:

| Source | Priority | Content |
|--------|----------|---------|
| Active task | High | [CURRENT_TASK.md](../../.cursor/context/CURRENT_TASK.md) |
| Specifications | High | Relevant `specs/` documents |
| Architecture | High | [ARCHITECTURE.md](../../.cursor/context/ARCHITECTURE.md) |
| Standards | Medium | Applicable `standards/` rules |
| Knowledge | Medium | Relevant `knowledge/` articles |
| Code | Medium | Files in scope of the operation |
| Memories | Low | [lessons-learned.md](../../.cursor/memories/lessons-learned.md) |

Context is assembled within a token budget. Sources are prioritized and truncated intelligently when the budget is exceeded.

### Prompt Management

Prompts are versioned assets (ADR-004):

| Asset Type | Location | Runtime Use |
|------------|----------|-------------|
| Cursor workflows | `.cursor/prompts/` | IDE integration (not runtime) |
| Composable blocks | `prompts/blocks/` | Assembled by `PromptManager` |
| Task templates | `prompts/templates/` | Assembled by `PromptManager` |
| Workflows | `prompts/workflows/` | Multi-step agent instructions |

`PromptManager` assembles prompts:

```
blocks/current-context.md
+ blocks/architecture.md
+ blocks/constraints.md
+ blocks/task.md
+ blocks/output-format.md
```

### Provider Adapter

The `ProviderAdapter` interface abstracts LLM providers:

| Method | Description |
|--------|-------------|
| `complete(prompt, options)` | Single completion request |
| `stream(prompt, options)` | Streaming completion |
| `embed(text)` | Generate embeddings (Phase 4+) |

Supported providers (implemented as infrastructure adapters):

| Provider | Priority | Use Case |
|----------|----------|----------|
| OpenAI | Phase 4 | General completion, code generation |
| Anthropic | Phase 4 | Long-context analysis, review |
| Local (Ollama) | Future | Offline development, privacy |

### Guardrails

Per [standards/ai/guardrails.md](../../standards/ai/guardrails.md) and ADR-004:

| Guardrail | Enforcement |
|-----------|-------------|
| No secrets in prompts | Input validator strips API keys, tokens, credentials |
| No private data | Context manager excludes `.env`, credentials files |
| Output validation | Generated code must pass `biome check` and `vitest` |
| Token budget | Cost tracker rejects requests exceeding session limit |
| Content filtering | Output filter blocks harmful or off-topic content |
| Human review | Agent outputs marked `pending-review` before auto-apply |

### Agent Architecture

Agents are multi-step AI workflows (Roadmap Phase 4):

| Agent | Input | Output | Workflow |
|-------|-------|--------|----------|
| **Planner** | Feature requirement | Implementation plan | Analyze → Plan → Review |
| **Reviewer** | Code diff | Review comments | Read → Analyze → Report |
| **Documenter** | Code changes | Documentation updates | Diff → Generate → Validate |
| **Detector** | Codebase | Problem report | Scan → Classify → Report |

Each agent defines:

- Input contract (type, validation)
- Output contract (type, schema)
- Failure scenarios (timeout, invalid output, budget exceeded)
- Evaluation criteria (accuracy, completeness, safety)
- Maximum token budget

### Observability

Every AI operation emits structured logs:

```json
{
  "operation": "complete",
  "agent": "planner",
  "provider": "openai",
  "model": "gpt-4",
  "inputTokens": 2400,
  "outputTokens": 850,
  "latencyMs": 3200,
  "costUsd": 0.042,
  "guardrailsPassed": true,
  "evaluationScore": 0.92
}
```

## Dependencies

### Upstream Specifications

| Spec | Dependency |
|------|------------|
| [000-project](../000-project/) | Layer rules, security policies |
| [001-cli](../001-cli/) | `genesis ai` commands |
| [003-plugin-system](../003-plugin-system/) | AI service plugin registration |

### Packages

| Package | Usage |
|---------|-------|
| `@genesis/core` | Configuration, logging, filesystem |
| `@genesis/shared` | Types, constants |

### Downstream Consumers

| Spec | Relationship |
|------|-------------|
| [006-game-generation](../006-game-generation/) | AI-assisted game design and documentation |
| [009-liveops](../009-liveops/) | AI-driven content and event generation |

## Future Implementation

### Phase 4 — Foundation

- Create `ContextManager` with file-based context assembly
- Create `PromptManager` loading from `prompts/blocks/`
- Define `ProviderAdapter` interface
- Implement OpenAI adapter
- Implement `GuardrailEngine` with secret detection
- Implement `CostTracker` with session budgets
- Unit tests for context assembly and guardrails

### Phase 4 — Agents

- Implement `AgentOrchestrator` with step-by-step execution
- Implement Planner, Reviewer, Documenter, Detector agents
- CLI commands: `genesis ai plan`, `genesis ai review`, `genesis ai docs`
- Implement `Evaluator` with quality scoring
- Integration tests with mock provider

### Future — Advanced

- Anthropic and local model adapters
- Vector database integration for RAG
- Embedding-based context retrieval
- Agent memory across sessions
- Custom agent definitions in `.genesis/agents/`

## Related Documents

- [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md) — Complete functional specification
- [DECISION_LOG.md](../../DECISION_LOG.md) — ADR-004 AI-Native Development
- [prompts/README.md](../../prompts/README.md) — Composable prompt engine
- [.cursor/rules/06-ai-development.mdc](../../.cursor/rules/06-ai-development.mdc) — AI development rules
- [006-game-generation](../006-game-generation/) — AI in game generation

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.1 | 2026-07-26 | Linked FUNCTIONAL_SPEC.md |
| 1.0.0 | 2026-07-26 | Initial approved specification |
