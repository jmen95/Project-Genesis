import { describe, expect, it } from 'vitest';

import { BuildReportStep } from './build-report.step.js';

describe('BuildReportStep', () => {
  it('aggregates file actions into GenerationResult', async () => {
    const step = new BuildReportStep();
    const result = await step.execute({
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
      results: [
        { outputPath: '/tmp/my-game/README.md', action: 'created', size: 10 },
        { outputPath: '/tmp/my-game/.gitignore', action: 'overwritten', size: 5 },
      ],
      report: {
        metadata: {
          genesisVersion: '0.3.0',
          templateId: 'default',
          templateVersion: '1.0.0',
          generatedAt: '2026-01-01T00:00:00.000Z',
          projectSchemaVersion: 1,
          filesSummary: { created: 1, overwritten: 1, skipped: 0 },
        },
      },
    });

    expect(result.created).toBe(1);
    expect(result.overwritten).toBe(1);
    expect(result.skipped).toBe(0);
    expect(result.report?.metadata?.templateId).toBe('default');
  });
});
