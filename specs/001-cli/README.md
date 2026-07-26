---
id: GEN-SPEC-001
title: CLI Specification
status: Approved
version: 1.0.0
owner: Project Genesis
phase: 1
package: "@genesis/cli"
---

# CLI Specification

## Purpose

Define the Genesis CLI — the primary user interface for Project Genesis. The CLI orchestrates project creation, module generation, plugin management, architecture validation, and AI-assisted workflows.

## Documents

| Document | Description |
|----------|-------------|
| [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md) | **Complete functional specification** — lifecycle, commands, DI, config, events, hooks, public API, sequence diagrams |
| This document | Overview, responsibilities, and implementation roadmap |

## Scope

### In Scope

- Command parsing, registration, and execution
- CLI lifecycle (init, run, exit)
- User-facing output (stdout, stderr, exit codes)
- Command discovery and help system
- Integration with kernel services via `@genesis/core`
- Delegation to plugins for technology-specific commands

### Out of Scope

- Business logic for generation (owned by `scaffolding`)
- Template rendering (owned by `template-engine`)
- Plugin implementation details (owned by `plugin-system`)
- Interactive TUI or GUI (future consideration)

## Goals

| Goal | Success Criteria |
|------|------------------|
| **Discoverable** | `genesis --help` lists all commands with descriptions |
| **Extensible** | Plugins register commands without modifying CLI source |
| **Testable** | Commands testable without real filesystem via injected services |
| **Consistent** | Uniform flag conventions, exit codes, and error messages |
| **Fast** | Cold start under 500ms on standard developer hardware |
| **Scriptable** | All operations available as non-interactive commands for CI |

## Responsibilities

### Command Framework

The CLI provides a command registration and dispatch system:

```mermaid
flowchart LR
    User[User] --> CLI[CLI Parser]
    CLI --> Registry[Command Registry]
    Registry --> BuiltIn[Built-in Commands]
    Registry --> Plugin[Plugin Commands]
    BuiltIn --> Core[@genesis/core]
    Plugin --> Kernel[Kernel]
```

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| `program.ts` | Presentation | Entry point, argument parsing |
| `CommandRegistry` | Application | Register, resolve, dispatch commands |
| `Command` interface | Domain | Contract every command implements |
| `OutputWriter` | Infrastructure | Formatted stdout/stderr |
| `CommandContext` | Application | Injected services per invocation |

### Built-in Commands (M1)

| Command | Description | Sprint |
|---------|-------------|--------|
| `genesis --version` | Print CLI and framework version | Sprint 1 |
| `genesis --help` | List available commands | Sprint 1 |
| `genesis create <name>` | Scaffold a new project | Sprint 4 |
| `genesis validate` | Run architecture and standards checks | Sprint 2+ |
| `genesis plugin list` | List installed plugins | Phase 2 |

### Command Interface

Every command implements:

| Method | Return | Description |
|--------|--------|-------------|
| `name` | `string` | Command identifier (e.g., `create`) |
| `description` | `string` | One-line description for help output |
| `execute(ctx, args)` | `Promise<CommandResult>` | Run the command |
| `registerFlags(parser)` | `void` | Register command-specific flags |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid usage (bad flags, missing arguments) |
| `3` | Validation failure |
| `4` | Plugin error |

### Output Conventions

- **Success messages** → stdout
- **Errors** → stderr with actionable guidance
- **Structured data** → JSON via `--json` flag (Phase 2)
- **Verbose logging** → stderr via `--verbose` flag, routed through `@genesis/core` logger

### Layer Boundaries

The CLI is a **presentation layer** package. It must not contain:

- Template rendering logic
- File generation logic
- Plugin loading implementation
- Domain business rules

It delegates to application services in `scaffolding`, `validator`, and the kernel.

## Dependencies

### Upstream Specifications

| Spec | Dependency |
|------|------------|
| [000-project](../000-project/) | Layer rules, package conventions |

### Packages

| Package | Usage |
|---------|-------|
| `@genesis/core` | Configuration, logging, filesystem, kernel access |
| `@genesis/shared` | Types, constants, version info |
| `@genesis/scaffolding` | `create` command delegation (Sprint 4) |
| `@genesis/validator` | `validate` command delegation (Sprint 2+) |

### Downstream Consumers

| Spec | Relationship |
|------|-------------|
| [003-plugin-system](../003-plugin-system/) | Plugins register CLI commands |
| [004-scaffolding](../004-scaffolding/) | `genesis create` invokes scaffolding |
| [005-ai-engine](../005-ai-engine/) | `genesis ai` commands (Phase 4) |

## Future Implementation

### Sprint 1 — Bootstrap

- Create `packages/cli` with entry point and bin field
- Implement `--version` and `--help`
- Set up `CommandRegistry` with registration API
- Wire to `@genesis/core` for logging

### Sprint 2 — Command Framework

- Implement `Command` interface and `CommandContext`
- Add `genesis validate` stub delegating to `@genesis/validator`
- Add `--verbose` flag
- Unit tests for registry dispatch and exit codes

### Sprint 4 — Create Command

- Implement `genesis create <name>` delegating to `@genesis/scaffolding`
- Add flags: `--template`, `--output`, `--dry-run`
- Integration test: command produces expected directory structure

### Phase 2 — Plugin Commands

- Plugins register commands via kernel (see [003-plugin-system](../003-plugin-system/))
- `genesis plugin list`, `genesis plugin install`
- `--json` output mode for scripting

### Phase 4 — AI Commands

- `genesis ai plan`, `genesis ai review`, `genesis ai docs`
- Delegates to [005-ai-engine](../005-ai-engine/)

## Related Documents

- [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md) — Complete functional specification
- [000-project](../000-project/) — Project-wide architecture
- [004-scaffolding](../004-scaffolding/) — Project generation
- [003-plugin-system](../003-plugin-system/) — Plugin command registration
- [standards/CODING_STANDARD.md](../../standards/CODING_STANDARD.md) — Coding conventions

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.1 | 2026-07-26 | Linked FUNCTIONAL_SPEC.md |
| 1.0.0 | 2026-07-26 | Initial approved specification |
