import type { IGenerationPipelineStep } from './pipeline-types.js';

export class GenerationPipeline {
  private readonly steps: readonly IGenerationPipelineStep[];

  constructor(steps: readonly IGenerationPipelineStep[]) {
    this.steps = steps;
  }

  async run<TOutput = unknown>(input: unknown): Promise<TOutput> {
    let current: unknown = input;

    for (const step of this.steps) {
      current = await step.execute(current);
    }

    return current as TOutput;
  }

  getStepNames(): readonly string[] {
    return this.steps.map((step) => step.name);
  }
}
