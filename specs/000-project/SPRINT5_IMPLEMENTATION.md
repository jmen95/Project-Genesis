# Sprint 5 Implementation Plan — Plugin SDK Foundation

**Status:** Implemented (Sprint 5).

**Prerequisite:** Sprint 4 Plugin Kernel complete.

**Goal:** Implement `@genesis/plugin-sdk` as the **only public authoring surface** for third-party plugin development.

---

## Approved decisions

| Decision | Resolution |
|----------|------------|
| Authoring surface | SDK declarative API only — no `PluginHost`, `PluginContext`, registries |
| Dual manifest | `genesis.plugin.json` (discovery) + `definePlugin()` (source of truth after load) |
| Manifest match | Fail on mismatch: `id`, `version`, `genesisVersion` |
| Capabilities | **Inferred** from templates/validators/hooks/commands — not author-declared |
| Public API | `definePlugin`, `defineTemplate`, `defineValidator`, `defineHook`, `defineCommand` only |
| Testing | `@genesis/plugin-sdk/testing` — small: validate definitions, run validators/hooks |
| Scaffold | `@genesis/create-plugin` — minimal plugin, not every capability |
| Example plugin | SDK-only dependency; canonical reference |
| Commands | `defineCommand()` API only; CLI Commander binding deferred to Sprint 5.5 |
| Kernel exports | Narrow to Framework API vs Runtime Internal; SDK is recommended public surface |
| Long-term | SDK is stable API; kernel evolves internally behind adapter |

---

## Scope boundaries

### In scope

- `@genesis/plugin-sdk` + `@genesis/plugin-sdk/testing`
- `@genesis/create-plugin` scaffold
- Migrate `@genesis/plugin-example` to SDK
- Kernel: optional capabilities in discovery manifest; manifest merge after load
- Kernel export narrowing + API documentation
- `docs/plugins/` author documentation

### Out of scope

- Unity, Godot, AI, marketplace, remote plugins
- Pipeline mutation
- CLI command binding from plugin commands (Sprint 5.5)
- `genesis plugin validate` command

---

## Acceptance criteria

| # | Criterion |
|---|-----------|
| AC1 | `@genesis/plugin-sdk` with five public `define*` helpers only |
| AC2 | Dual manifest validation (id, version, genesisVersion) with structured error |
| AC3 | Capabilities inferred — not required in author manifest |
| AC4 | `@genesis/plugin-sdk/testing` harness for definitions, validators, hooks |
| AC5 | `@genesis/create-plugin` generates minimal plugin |
| AC6 | `@genesis/plugin-example` depends only on `@genesis/plugin-sdk` |
| AC7 | Kernel exports narrowed; Framework vs Internal documented |
| AC8 | `pnpm build && pnpm lint && pnpm test` pass |
| AC9 | `genesis plugin list` shows example as `registered` |
| AC10 | Author docs: getting-started, define-plugin, testing, versioning |

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-26 | Initial plan |
| 1.0.0 | 2026-07-26 | Approved with inferred capabilities, minimal API, dual manifest validation |
