import { describe, expect, it } from 'vitest';

import { ValidateInputStep } from './validate-input.step.js';

describe('ValidateInputStep', () => {
  it('passes request through unchanged', async () => {
    const step = new ValidateInputStep();
    const request = {
      projectName: 'my-game',
      outputPath: '/tmp/my-game',
      genesisVersion: '0.3.0',
    };

    const output = await step.execute({ request });
    expect(output.request).toEqual(request);
  });
});
