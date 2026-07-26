import { describe, expect, it, vi } from 'vitest';

import type { IValidationService } from '@genesis/validator';

import { ValidateOutputStep } from './validate-output.step.js';

describe('ValidateOutputStep', () => {
  it('skips validation when skipValidation is set', async () => {
    const validationService: IValidationService = {
      validate: vi.fn(),
    };

    const step = new ValidateOutputStep(validationService);
    const input = {
      request: {
        projectName: 'my-game',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
        skipValidation: true,
      },
      template: {
        rootPath: '/templates/default',
        manifest: { id: 'default', version: '1.0.0', files: [] },
      },
      renderContext: { projectName: 'my-game' },
      plan: {
        projectName: 'my-game',
        templateId: 'default',
        outputRoot: '/tmp/my-game',
        dryRun: false,
        items: [],
      },
      results: [],
    };

    const output = await step.execute(input);

    expect(validationService.validate).not.toHaveBeenCalled();
    expect(output.validation).toBeUndefined();
  });

  it('runs validation for normal generation', async () => {
    const validationService: IValidationService = {
      validate: vi.fn().mockResolvedValue({
        success: true,
        errorCount: 0,
        warningCount: 0,
        issues: [],
      }),
    };

    const step = new ValidateOutputStep(validationService);
    await step.execute({
      request: {
        projectName: 'my-game',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
      },
      template: {
        rootPath: '/templates/default',
        manifest: { id: 'default', version: '1.0.0', files: [] },
      },
      renderContext: { projectName: 'my-game' },
      plan: {
        projectName: 'my-game',
        templateId: 'default',
        outputRoot: '/tmp/my-game',
        dryRun: false,
        items: [],
      },
      results: [],
    });

    expect(validationService.validate).toHaveBeenCalledWith({
      kind: 'project-output',
      rootPath: '/tmp/my-game',
    });
  });
});
