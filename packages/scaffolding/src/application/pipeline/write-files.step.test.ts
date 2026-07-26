import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { NodeFilesystem } from '@genesis/core';

import { WriteFilesStep } from './write-files.step.js';

describe('WriteFilesStep', () => {
  it('writes rendered files to disk', async () => {
    const filesystem = new NodeFilesystem();
    const outputPath = await mkdtemp(join(tmpdir(), 'genesis-write-'));
    const step = new WriteFilesStep(filesystem);

    try {
      const output = await step.execute({
        request: {
          projectName: 'my-game',
          outputPath,
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
          outputRoot: outputPath,
          dryRun: false,
          items: [],
        },
        renderedItems: [
          {
            outputPath: join(outputPath, 'README.md'),
            relativePath: 'README.md',
            content: '# My Game',
          },
        ],
      });

      const content = await readFile(join(outputPath, 'README.md'), 'utf8');
      expect(content).toBe('# My Game');
      expect(output.results[0]?.action).toBe('created');
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });

  it('returns dry-run results without writing', async () => {
    const filesystem = new NodeFilesystem();
    const outputPath = await mkdtemp(join(tmpdir(), 'genesis-write-dry-'));
    const step = new WriteFilesStep(filesystem);

    try {
      const output = await step.execute({
        request: {
          projectName: 'my-game',
          outputPath,
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
          outputRoot: outputPath,
          dryRun: true,
          items: [],
        },
        renderedItems: [
          {
            outputPath: join(outputPath, 'README.md'),
            relativePath: 'README.md',
            content: '# My Game',
          },
        ],
      });

      expect(output.results[0]?.action).toBe('dry-run');
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });
});
