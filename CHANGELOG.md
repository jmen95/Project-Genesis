# Changelog

All notable changes to Project Genesis are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
