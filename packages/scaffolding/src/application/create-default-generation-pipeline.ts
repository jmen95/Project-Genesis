import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateProvider,
  ITemplateRenderer,
} from '@genesis/template-engine';
import { ComponentOrdering, TemplateVariableResolver } from '@genesis/template-engine';
import type { IValidationService } from '@genesis/validator';

import { GenerationPipeline } from '../domain/generation-pipeline.js';
import type { IMetadataWriter } from '../domain/metadata-writer.interface.js';
import { FilesystemMetadataWriter } from '../infrastructure/filesystem-metadata-writer.js';
import { ConflictDetector } from './conflict-detector.js';
import { GenerationPlanBuilder } from './generation-plan-builder.js';
import { BuildPlanStep, DetectConflictsStep } from './pipeline/build-plan.step.js';
import { BuildReportStep } from './pipeline/build-report.step.js';
import { LoadTemplateStep } from './pipeline/load-template.step.js';
import { PersistMetadataStep } from './pipeline/persist-metadata.step.js';
import { RenderStep } from './pipeline/render.step.js';
import { ResolveContextStep } from './pipeline/resolve-context.step.js';
import { ValidateInputStep } from './pipeline/validate-input.step.js';
import { ValidateOutputStep } from './pipeline/validate-output.step.js';
import { WriteFilesStep } from './pipeline/write-files.step.js';

export interface CreateDefaultGenerationPipelineOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateRenderer: ITemplateRenderer;
  readonly contextAssembler: ContextAssembler;
  readonly validationService: IValidationService;
  readonly metadataWriter?: IMetadataWriter;
  readonly variableResolver?: InstanceType<typeof TemplateVariableResolver>;
  readonly planBuilder?: GenerationPlanBuilder;
}

export function createDefaultGenerationPipeline(
  options: CreateDefaultGenerationPipelineOptions,
): GenerationPipeline {
  const metadataWriter = options.metadataWriter ?? new FilesystemMetadataWriter(options.filesystem);
  const variableResolver = options.variableResolver ?? new TemplateVariableResolver();
  const planBuilder = options.planBuilder ?? new GenerationPlanBuilder(new ComponentOrdering());

  return new GenerationPipeline([
    new ValidateInputStep(),
    new LoadTemplateStep(options.templateProvider),
    new ResolveContextStep(options.contextAssembler, variableResolver),
    new BuildPlanStep(planBuilder),
    new DetectConflictsStep(new ConflictDetector(options.filesystem)),
    new RenderStep(options.filesystem, options.templateRenderer),
    new WriteFilesStep(options.filesystem),
    new ValidateOutputStep(options.validationService),
    new PersistMetadataStep(metadataWriter),
    new BuildReportStep(),
  ]);
}
