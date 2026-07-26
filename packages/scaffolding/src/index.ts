import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateEngine,
  ITemplateProvider,
} from '@genesis/template-engine';
import type { IValidationService } from '@genesis/validator';

import { ScaffoldingService } from './application/scaffolding-service.js';
import type { ScaffoldingServiceOptions } from './application/scaffolding-service.js';

export interface CreateScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateEngine: ITemplateEngine;
  readonly contextAssembler: ContextAssembler;
  readonly validationService: IValidationService;
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
export type { IScaffoldingService } from './domain/scaffolding.interface.js';
export type {
  IGenerationPipelineStep,
  PipelineInput,
  ValidatedInput,
  TemplateLoaded,
  ContextResolved,
  PlanBuilt,
  ConflictsChecked,
  Rendered,
  ValidatedOutput,
} from './domain/pipeline-types.js';
export { OutputConflictError } from './domain/scaffolding.errors.js';
export { ScaffoldingService } from './application/scaffolding-service.js';
export { ConflictDetector } from './application/conflict-detector.js';
export { GenerationPlanBuilder } from './application/generation-plan-builder.js';
export { ValidateInputStep } from './application/pipeline/validate-input.step.js';
export { LoadTemplateStep } from './application/pipeline/load-template.step.js';
export { ResolveContextStep } from './application/pipeline/resolve-context.step.js';
export { BuildPlanStep } from './application/pipeline/build-plan.step.js';
export { DetectConflictsStep } from './application/pipeline/build-plan.step.js';
export { RenderAndWriteStep } from './application/pipeline/render-and-write.step.js';
export { ValidateOutputStep } from './application/pipeline/validate-output.step.js';
export { BuildReportStep } from './application/pipeline/build-report.step.js';
