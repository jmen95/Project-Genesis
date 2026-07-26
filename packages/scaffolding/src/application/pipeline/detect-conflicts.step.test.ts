import { describe, expect, it, vi } from 'vitest';

import type { ConflictDetector } from '../conflict-detector.js';
import { DetectConflictsStep } from './build-plan.step.js';

describe('DetectConflictsStep', () => {
  it('asserts writable output before continuing', async () => {
    const conflictDetector = {
      assertWritableOutput: vi.fn().mockResolvedValue(undefined),
    } as unknown as ConflictDetector;

    const step = new DetectConflictsStep(conflictDetector);
    const input = {
      request: {
        projectName: 'my-game',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
        force: true,
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
    };

    const output = await step.execute(input);

    expect(conflictDetector.assertWritableOutput).toHaveBeenCalledWith('/tmp/my-game', true);
    expect(output).toEqual(input);
  });
});
