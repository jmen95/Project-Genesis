import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateProvider,
  ITemplateRenderer,
} from '@genesis/template-engine';
import type { IValidationService } from '@genesis/validator';

import { ScaffoldingService } from './application/scaffolding-service.js';
import type { ScaffoldingServiceOptions } from './application/scaffolding-service.js';
import type { GenerationPipeline } from './domain/generation-pipeline.js';
import type { IMetadataWriter } from './domain/metadata-writer.interface.js';

export interface CreateScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateRenderer: ITemplateRenderer;
  readonly contextAssembler: ContextAssembler;
  readonly validationService: IValidationService;
  readonly pipeline?: GenerationPipeline;
  readonly metadataWriter?: IMetadataWriter;
}

export function createScaffoldingService(
  options: CreateScaffoldingServiceOptions,
): ScaffoldingService {
  return new ScaffoldingService(options satisfies ScaffoldingServiceOptions);
}

export type { CreateProjectRequest } from './domain/create-project-request.js';
export type {
  GenerationPlan,
  GenerationPlanItem,
  GenerationResult,
} from './domain/generation-plan.js';
export type { GenerationMetadata, GenerationReport } from './domain/generation-metadata.js';
export type { IMetadataWriter, MetadataWriteOptions } from './domain/metadata-writer.interface.js';
export type { IScaffoldingService } from './domain/scaffolding.interface.js';
export type {
  IGenerationPipelineStep,
  PipelineInput,
  ValidatedInput,
  TemplateLoaded,
  ContextResolved,
  PlanBuilt,
  ConflictsChecked,
  ContentRendered,
  FilesWritten,
  ValidatedOutput,
  MetadataPersisted,
} from './domain/pipeline-types.js';
export { GenerationPipeline } from './domain/generation-pipeline.js';
export { OutputConflictError, InputValidationError } from './domain/scaffolding.errors.js';
export { ScaffoldingService } from './application/scaffolding-service.js';
export { createDefaultGenerationPipeline } from './application/create-default-generation-pipeline.js';
export type { CreateDefaultGenerationPipelineOptions } from './application/create-default-generation-pipeline.js';
