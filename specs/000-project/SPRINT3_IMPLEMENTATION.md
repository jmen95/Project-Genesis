# Sprint 3 Implementation Plan — Project Foundation (Schema, Pipeline, Validation)

**Status:** Approved — architectural adjustments applied.

---

## Architectural adjustments (approved)

| # | Change | Rationale |
|---|--------|-----------|
| 1 | `@genesis/config` independent from generated projects | Generated `genesis.config.ts` represents schema; no runtime dep on `@genesis/config` in games |
| 2 | `IValidationService` (not `IValidatorService`) | Validates multiple targets; not a single validator entity |
| 3 | Composable `IValidationRule<T>` | Rules registered externally; service orchestrates only |
| 4 | Immutable pipeline stages `IGenerationPipelineStep<TInput, TOutput>` | No shared mutable context between stages |
| 5 | `ContextAssembler` stays in template-engine | Project config concerns do not move into template-engine |
| 6 | Explicit versioning strategy | `schemaVersion` / `$manifestVersion`; migration docs; no migrations implemented |
| 7 | Extended acceptance criteria | Independent stage tests, pluggable rules, Sprint 2 backward compat |

---

## Versioning strategy

### `GenesisProjectConfig` (`schemaVersion`)

| Version | Status | Notes |
|---------|--------|-------|
| `1` | Current (Sprint 3) | Game-project subset |
| `2+` | Future | Migrations not implemented in Sprint 3 |

**Compatibility rules:**
- Missing `schemaVersion` → treat as `1` when all required v1 fields present
- Unknown `schemaVersion` → validation error with upgrade hint
- **Migration strategy (documented, not implemented):** `migrateConfig(from, to)` in `@genesis/config` Sprint 4+

### `genesis.template.json` (`$manifestVersion`)

| Version | Status | Notes |
|---------|--------|-------|
| absent / `"1.0"` | Supported | Sprint 2 behavior unchanged |
| `"1.1"` | Sprint 3 | `variables`, `components`, `genesis.minVersion` |

**Compatibility rules:**
- Absent `$manifestVersion` → v1.0 discovery + merge behavior
- Unknown version → load error with supported versions list
- **Migration strategy (documented, not implemented):** manifest upgrade tooling Sprint 4+

---

## `@genesis/config` — framework-only package

**Not a dependency of generated game projects.**

Provides:
- Schema types (`GenesisProjectConfig`, `schemaVersion`)
- `validateGenesisConfig(input: unknown)` → `Result<GenesisProjectConfig, ValidationIssue[]>`
- `serializeGenesisConfig(config)` → self-contained `genesis.config.ts` source string
- `parseGenesisConfigSource(source)` → extract + validate from generated file content

Generated projects use plain `export default { schemaVersion: 1, ... }` with no imports.

---

## Validation system

```typescript
interface IValidationRule<T> {
  readonly id: string;
  validate(target: T): ValidationIssue[] | Promise<ValidationIssue[]>;
}

interface IValidationService {
  validate(target: ValidationTarget): Promise<ValidationReport>;
}
```

`ValidationService` registers rules by target kind. New rules added without modifying service internals.

---

## Generation pipeline (immutable stages)

```typescript
interface IGenerationPipelineStep<TInput, TOutput> {
  readonly name: string;
  execute(input: TInput): Promise<TOutput>;
}
```

Stage chain: `PipelineInput` → `ValidatedInput` → `TemplateLoaded` → `ContextResolved` → `PlanBuilt` → `ConflictsChecked` → `Rendered` → `ValidatedOutput` → `GenerationResult`

---

## Acceptance criteria

| # | Criterion |
|---|-----------|
| AC1 | `pnpm build`, `pnpm lint`, `pnpm test` pass |
| AC2 | `@genesis/config` exports types, validation, serialization (no generated-project runtime dep) |
| AC3 | `@genesis/validator` exports `IValidationService` + composable `IValidationRule<T>` |
| AC4 | `genesis.template.json` v1.1 loads; v1.0 manifests unchanged |
| AC5 | `GenerationPipeline` uses immutable `IGenerationPipelineStep<TInput, TOutput>` stages |
| AC6 | `genesis new my-game` generates self-contained schema-compliant `genesis.config.ts` |
| AC7 | Post-generation validation runs; warnings/errors in report |
| AC8 | `genesis new --skip-validation` skips post-generation validation |
| AC9 | `genesis validate` exits 0 on valid project, 1 on errors, 2 on bad path |
| AC10 | Dependency direction preserved |
| AC11 | CLI handlers/commands do not import `node:fs` |
| AC12 | CI smoke: `genesis new --dry-run` + `genesis validate` on fixture |
| AC13 | Pipeline stages testable independently |
| AC14 | Validation rules addable without modifying `ValidationService` |
| AC15 | Sprint 2 templates remain compatible |
| AC16 | `genesis new` behavior backward compatible (same flags, same structure) |
