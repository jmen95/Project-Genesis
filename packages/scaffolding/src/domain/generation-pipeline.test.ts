import { describe, expect, it } from 'vitest';

import { GenerationPipeline } from './generation-pipeline.js';
import type { IGenerationPipelineStep } from './pipeline-types.js';

describe('GenerationPipeline', () => {
  it('executes steps in declaration order', async () => {
    const order: string[] = [];

    const createStep = (name: string): IGenerationPipelineStep<number, number> => ({
      name,
      execute: async (input: number) => {
        order.push(name);
        return input + 1;
      },
    });

    const pipeline = new GenerationPipeline([
      createStep('first'),
      createStep('second'),
      createStep('third'),
    ]);

    const result = await pipeline.run<number>(0);

    expect(order).toEqual(['first', 'second', 'third']);
    expect(result).toBe(3);
  });

  it('exposes deterministic step names', () => {
    const pipeline = new GenerationPipeline([
      { name: 'alpha', execute: async (input) => input },
      { name: 'beta', execute: async (input) => input },
    ]);

    expect(pipeline.getStepNames()).toEqual(['alpha', 'beta']);
  });
});
