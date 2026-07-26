import { describe, expect, it, vi } from 'vitest';

import type { GenerationPlan } from '../../domain/generation-plan.js';
import type { GenerationPlanBuilder } from '../generation-plan-builder.js';
import { BuildPlanStep } from './build-plan.step.js';

describe('BuildPlanStep', () => {
  it('delegates plan construction to GenerationPlanBuilder', async () => {
    const plan: GenerationPlan = {
      projectName: 'my-game',
      templateId: 'default',
      outputRoot: '/tmp/my-game',
      dryRun: false,
      items: [],
    };

    const planBuilder = {
      build: vi.fn().mockReturnValue(plan),
    } as unknown as GenerationPlanBuilder;

    const step = new BuildPlanStep(planBuilder);
    const request = {
      projectName: 'my-game',
      outputPath: '/tmp/my-game',
      genesisVersion: '0.3.0',
    };
    const template = {
      rootPath: '/templates/default',
      manifest: { id: 'default', version: '1.0.0', files: [] },
    };

    const output = await step.execute({
      request,
      template,
      renderContext: { projectName: 'my-game' },
    });

    expect(planBuilder.build).toHaveBeenCalledWith(request, template);
    expect(output.plan).toBe(plan);
  });
});
