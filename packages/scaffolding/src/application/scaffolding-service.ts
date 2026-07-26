import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateProvider,
  ITemplateRenderer,
} from '@genesis/template-engine';
import type { IValidationService } from '@genesis/validator';

import type { CreateProjectRequest } from '../domain/create-project-request.js';
import type { GenerationPipeline } from '../domain/generation-pipeline.js';
import type { GenerationResult } from '../domain/generation-plan.js';
import type { IMetadataWriter } from '../domain/metadata-writer.interface.js';
import type { PipelineInput } from '../domain/pipeline-types.js';
import type { IScaffoldingService } from '../domain/scaffolding.interface.js';
import { createDefaultGenerationPipeline } from './create-default-generation-pipeline.js';
import type { GenerationPlanBuilder } from './generation-plan-builder.js';

export interface ScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateRenderer: ITemplateRenderer;
  readonly contextAssembler: ContextAssembler;
  readonly validationService: IValidationService;
  readonly pipeline?: GenerationPipeline;
  readonly metadataWriter?: IMetadataWriter;
  readonly planBuilder?: GenerationPlanBuilder;
}

export class ScaffoldingService implements IScaffoldingService {
  private readonly pipeline: GenerationPipeline;

  constructor(options: ScaffoldingServiceOptions) {
    this.pipeline =
      options.pipeline ??
      createDefaultGenerationPipeline({
        filesystem: options.filesystem,
        templateProvider: options.templateProvider,
        templateRenderer: options.templateRenderer,
        contextAssembler: options.contextAssembler,
        validationService: options.validationService,
        ...(options.metadataWriter !== undefined ? { metadataWriter: options.metadataWriter } : {}),
        ...(options.planBuilder !== undefined ? { planBuilder: options.planBuilder } : {}),
      });
  }

  async createProject(request: CreateProjectRequest): Promise<GenerationResult> {
    const input: PipelineInput = { request };
    return this.pipeline.run<GenerationResult>(input);
  }
}
