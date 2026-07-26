# Changelog

All notable changes to Project Genesis are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `@genesis/config` — project schema types, validation, and serialization (framework-only)
- `@genesis/validator` — composable `IValidationService` and `IValidationRule<T>`
- Immutable `IGenerationPipelineStep<TInput, TOutput>` generation pipeline
- `genesis.template.json` v1.1 with variables, components, and min Genesis version
- Self-contained `genesis.config.ts` with `schemaVersion` (no `@genesis/config` runtime dep)
- `genesis validate [path]` command
- `genesis new --skip-validation` flag
- Post-generation validation report in `genesis new` output

## [0.2.0] - 2026-07-26

### Added

- `@genesis/template-engine` — `ITemplateRenderer`, `ITemplateProvider`, `ContextAssembler`, Handlebars rendering
- `@genesis/scaffolding` — project scaffolding with generation plans and conflict detection
- `genesis new <project-name>` — scaffold projects from default template
- Default template at `packages/templates/projects/default/` with `genesis.template.json`
- `--dry-run` and `--force` flags for project scaffolding

## [0.1.0] - 2026-07-26

### Added

- Turborepo monorepo with pnpm workspaces
- `@genesis/shared` — types, constants, and pure utilities
- `@genesis/core` — infrastructure services with Clean Architecture layout
- `@genesis/cli` — `genesis` executable with `--help`, `--version`, and `doctor`
- Biome linting and formatting, Vitest testing, TypeScript strict mode
- GitHub Actions workflow for build, lint, and test
- Scaffold packages: `@genesis/templates`, `@genesis/plugins`

[0.1.0]: https://github.com/project-genesis/project-genesis/releases/tag/v0.1.0
