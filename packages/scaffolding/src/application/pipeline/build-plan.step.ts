import type {
  ConflictsChecked,
  ContextResolved,
  IGenerationPipelineStep,
  PlanBuilt,
} from '../../domain/pipeline-types.js';
import { GenerationPlanBuilder } from '../generation-plan-builder.js';

export class BuildPlanStep implements IGenerationPipelineStep<ContextResolved, PlanBuilt> {
  readonly name = 'build-plan';

  private readonly planBuilder = new GenerationPlanBuilder();

  async execute(input: ContextResolved): Promise<PlanBuilt> {
    const plan = this.planBuilder.build(input.request, input.template);
    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan,
    };
  }
}

export class DetectConflictsStep implements IGenerationPipelineStep<PlanBuilt, ConflictsChecked> {
  readonly name = 'detect-conflicts';

  private readonly conflictDetector: import('../conflict-detector.js').ConflictDetector;

  constructor(conflictDetector: import('../conflict-detector.js').ConflictDetector) {
    this.conflictDetector = conflictDetector;
  }

  async execute(input: PlanBuilt): Promise<ConflictsChecked> {
    await this.conflictDetector.assertWritableOutput(
      input.request.outputPath,
      input.request.force ?? false,
    );
    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
    };
  }
}
