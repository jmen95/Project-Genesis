import { describe, expect, it } from 'vitest';

import { InputValidationError } from '../../domain/scaffolding.errors.js';
import { ValidateInputStep } from './validate-input.step.js';

describe('ValidateInputStep', () => {
  const step = new ValidateInputStep();

  it('normalizes valid input and defaults template id', async () => {
    const output = await step.execute({
      request: {
        projectName: 'my-game',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
      },
    });

    expect(output.request).toEqual({
      projectName: 'my-game',
      templateId: 'default',
      outputPath: '/tmp/my-game',
      genesisVersion: '0.3.0',
    });
  });

  it('rejects invalid project names', async () => {
    await expect(
      step.execute({
        request: {
          projectName: 'My-Game',
          outputPath: '/tmp/my-game',
          genesisVersion: '0.3.0',
        },
      }),
    ).rejects.toBeInstanceOf(InputValidationError);
  });

  it('rejects invalid template ids', async () => {
    await expect(
      step.execute({
        request: {
          projectName: 'my-game',
          templateId: 'INVALID',
          outputPath: '/tmp/my-game',
          genesisVersion: '0.3.0',
        },
      }),
    ).rejects.toBeInstanceOf(InputValidationError);
  });
});
