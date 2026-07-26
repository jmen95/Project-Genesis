
# Project Genesis Architecture

## Main Architecture Principles

Project Genesis follows:

- Clean Architecture
- SOLID Principles
- Domain Driven Design
- Dependency Injection


## High Level Architecture


CLI

↓

Kernel

↓

Services

↓

Plugins

↓

Generators

↓

Templates



## Main Packages


packages/cli

Responsible for:

- User interaction
- Commands
- CLI lifecycle


packages/core

Responsible for:

- Shared infrastructure
- Filesystem
- Configuration
- Logging


packages/shared

Responsible for:

- Shared types
- Constants
- Utilities


packages/scaffolding

Responsible for:

- Project generation
- File creation
- Templates


packages/template-engine

Responsible for:

- Template processing
- Variables
- Rendering


packages/ai

Responsible for:

- AI context
- Prompt management
- Future LLM integrations


## Architectural Rule

Dependencies must point inward.

Business logic must not depend on external frameworks.

