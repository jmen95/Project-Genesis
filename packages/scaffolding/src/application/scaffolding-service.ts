import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateEngine,
  ITemplateProvider,
} from '@genesis/template-engine';
import type { IValidationService } from '@genesis/validator';

import type { CreateProjectRequest } from '../domain/create-project-request.js';
import type { GenerationPlan, GenerationResult } from '../domain/generation-plan.js';
import type {
  ConflictsChecked,
  ContextResolved,
  PipelineInput,
  PlanBuilt,
  Rendered,
  TemplateLoaded,
  ValidatedInput,
  ValidatedOutput,
} from '../domain/pipeline-types.js';
import type { IScaffoldingService } from '../domain/scaffolding.interface.js';
import { ConflictDetector } from './conflict-detector.js';
import { GenerationPlanBuilder } from './generation-plan-builder.js';
import { BuildPlanStep, DetectConflictsStep } from './pipeline/build-plan.step.js';
import { BuildReportStep } from './pipeline/build-report.step.js';
import { LoadTemplateStep } from './pipeline/load-template.step.js';
import { RenderAndWriteStep } from './pipeline/render-and-write.step.js';
import { ResolveContextStep } from './pipeline/resolve-context.step.js';
import { ValidateInputStep } from './pipeline/validate-input.step.js';
import { ValidateOutputStep } from './pipeline/validate-output.step.js';

export interface ScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateEngine: ITemplateEngine;
  readonly contextAssembler: ContextAssembler;
  readonly validationService: IValidationService;
}

export class ScaffoldingService implements IScaffoldingService {
  private readonly templateProvider: ITemplateProvider;
  private readonly planBuilder = new GenerationPlanBuilder();
  private readonly validateInputStep = new ValidateInputStep();
  private readonly loadTemplateStep: LoadTemplateStep;
  private readonly resolveContextStep: ResolveContextStep;
  private readonly buildPlanStep = new BuildPlanStep();
  private readonly detectConflictsStep: DetectConflictsStep;
  private readonly renderAndWriteStep: RenderAndWriteStep;
  private readonly validateOutputStep: ValidateOutputStep;
  private readonly buildReportStep = new BuildReportStep();

  constructor(options: ScaffoldingServiceOptions) {
    this.templateProvider = options.templateProvider;
    this.loadTemplateStep = new LoadTemplateStep(options.templateProvider);
    this.resolveContextStep = new ResolveContextStep(options.contextAssembler);
    this.detectConflictsStep = new DetectConflictsStep(new ConflictDetector(options.filesystem));
    this.renderAndWriteStep = new RenderAndWriteStep(options.filesystem, options.templateEngine);
    this.validateOutputStep = new ValidateOutputStep(options.validationService);
  }

  async buildProjectPlan(request: CreateProjectRequest): Promise<GenerationPlan> {
    const templateId = request.templateId ?? 'default';
    const template = await this.templateProvider.loadProjectTemplate(templateId);
    return this.planBuilder.build(request, template);
  }

  async createProject(request: CreateProjectRequest): Promise<GenerationResult> {
    const input: PipelineInput = { request };

    const validated: ValidatedInput = await this.validateInputStep.execute(input);
    const loaded: TemplateLoaded = await this.loadTemplateStep.execute(validated);
    const resolved: ContextResolved = await this.resolveContextStep.execute(loaded);
    const planned: PlanBuilt = await this.buildPlanStep.execute(resolved);
    const checked: ConflictsChecked = await this.detectConflictsStep.execute(planned);
    const rendered: Rendered = await this.renderAndWriteStep.execute(checked);
    const validatedOutput: ValidatedOutput = await this.validateOutputStep.execute(rendered);
    return this.buildReportStep.execute(validatedOutput);
  }
}
