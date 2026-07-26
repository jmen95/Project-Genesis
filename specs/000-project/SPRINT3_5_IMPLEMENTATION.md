# Sprint 3.5 Implementation Plan — Foundation Hardening

**Status:** Implemented — architectural adjustments applied.

---

## Architectural adjustments (approved)

| # | Change | Rationale |
|---|--------|-----------|
| 1 | `GenerationPipeline` stays generic | Orchestrates only `IGenerationPipelineStep`; no game-generation concepts |
| 2 | `IMetadataWriter` abstraction | Pipeline does not write `.genesis/metadata.json` directly |
| 3 | `GenerationMetadata` ≠ `GenerationReport` | Persist stable metadata only; transient details stay in report |
| 4 | `ComponentOrdering` deterministic errors | COMP-001/002/003 for missing, circular, duplicate component ids |
| 5 | `TemplateVariableResolver.resolve()` | Returns immutable resolved context; no `apply(context)` mutation |
| 6 | Extended acceptance criteria | Deterministic order, metadata failure isolation, v1.0 structure parity |

---

## GenerationPipeline (generic)

```typescript
// @genesis/scaffolding — domain only, no game concepts
export interface IGenerationPipelineStep<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  execute(input: TInput): Promise<TOutput>;
}

export class GenerationPipeline {
  constructor(private readonly steps: readonly IGenerationPipelineStep[]) {}
  async run<TOutput = unknown>(input: unknown): Promise<TOutput> { /* ... */ }
}
```

`createDefaultGenerationPipeline()` lives in scaffolding as composition root.

---

## Metadata abstraction

```typescript
export interface GenerationMetadata {
  readonly genesisVersion: string;
  readonly templateId: string;
  readonly templateVersion: string;
  readonly generatedAt: string;
  readonly projectSchemaVersion: number;
  readonly filesSummary: {
    readonly created: number;
    readonly overwritten: number;
    readonly skipped: number;
  };
}

export interface IMetadataWriter {
  write(options: { readonly outputRoot: string; readonly metadata: GenerationMetadata }): Promise<void>;
}
```

`FilesystemMetadataWriter` implements via `IFilesystem`. Metadata failures are caught in `PersistMetadataStep` — files already written are not rolled back.

---

## Template variables

```typescript
resolvedVariables = resolver.resolve(manifest.variables, input);
// Returns immutable ResolvedTemplateVariables — merged into context in ResolveContextStep
```

---

## Component ordering errors

| Code | Condition |
|------|-----------|
| COMP-001 | Missing `dependsOn` target |
| COMP-002 | Circular dependency |
| COMP-003 | Duplicate component id |

---

## Acceptance criteria

| # | Criterion |
|---|-----------|
| AC1 | `pnpm build`, `pnpm lint`, `pnpm test` pass |
| AC2 | `GenerationPipeline` generic; adding steps does not modify pipeline class |
| AC3 | `createDefaultGenerationPipeline()` composes default steps |
| AC4 | `ValidateInputStep` validates name, template id, required input; handlers do not validate |
| AC5 | `RenderStep` and `WriteFilesStep` separated |
| AC6 | Dry-run unchanged |
| AC7 | Manifest v1.1 variables: schema, defaults, validation |
| AC8 | Manifest v1.1 components: topological order |
| AC9 | v1.0 fixture generates same file structure as Sprint 2 |
| AC10 | `.genesis/metadata.json` via `IMetadataWriter` on success |
| AC11 | `--skip-validation` skips post-gen validation; metadata still written |
| AC12 | One unit test per pipeline step |
| AC13 | Isolated validation rule tests |
| AC14 | Pipeline composition test with mock step |
| AC15 | Docs synced — no `@genesis/config` in generated project examples |
| AC16 | Sprint 2 CLI contract preserved |
| AC17 | CI smoke includes metadata verification |
| AC18 | Pipeline execution order is deterministic |
| AC19 | Metadata write failure does not corrupt generated files |
| AC20 | Component ordering identical output for identical input |
| AC21 | v1.0 templates generate exactly the same file structure |
