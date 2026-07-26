import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { NodeFilesystem } from '@genesis/core';
import { createDefaultGenerationPipeline } from '@genesis/scaffolding';
import { createTemplateEngineBundle } from '@genesis/template-engine';
import { createDefaultValidationService } from '@genesis/validator';

const templatesRoot = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  '..',
  '..',
  '..',
  'templates',
);

async function listRelativeFiles(root: string, current = ''): Promise<string[]> {
  const absolute = join(root, current);
  const entries = await readdir(absolute);
  const files: string[] = [];

  for (const entry of entries) {
    const relative = current.length > 0 ? `${current}/${entry}` : entry;
    const entryStat = await stat(join(root, relative));
    if (entryStat.isDirectory()) {
      files.push(...(await listRelativeFiles(root, relative)));
      continue;
    }
    if (entryStat.isFile()) {
      files.push(relative);
    }
  }

  return files.sort();
}

describe('createDefaultGenerationPipeline', () => {
  it('composes steps in deterministic order', () => {
    const filesystem = new NodeFilesystem();
    const templateBundle = createTemplateEngineBundle({
      filesystem,
      templatesRoot,
      genesisVersion: '0.3.0',
    });
    const validationService = createDefaultValidationService(filesystem);

    const pipeline = createDefaultGenerationPipeline({
      filesystem,
      templateProvider: templateBundle.provider,
      templateRenderer: templateBundle.renderer,
      contextAssembler: templateBundle.contextAssembler,
      validationService,
    });

    expect(pipeline.getStepNames()).toEqual([
      'validate-input',
      'load-template',
      'resolve-context',
      'build-plan',
      'detect-conflicts',
      'render',
      'write-files',
      'validate-output',
      'persist-metadata',
      'build-report',
    ]);
  });

  it('writes metadata without corrupting generated files when metadata write fails', async () => {
    const filesystem = new NodeFilesystem();
    const templateBundle = createTemplateEngineBundle({
      filesystem,
      templatesRoot,
      genesisVersion: '0.3.0',
    });
    const validationService = createDefaultValidationService(filesystem);
    const outputPath = await mkdtemp(join(tmpdir(), 'genesis-metadata-fail-'));

    const pipeline = createDefaultGenerationPipeline({
      filesystem,
      templateProvider: templateBundle.provider,
      templateRenderer: templateBundle.renderer,
      contextAssembler: templateBundle.contextAssembler,
      validationService,
      metadataWriter: {
        write: async () => {
          throw new Error('metadata unavailable');
        },
      },
    });

    try {
      const result = await pipeline.run({
        request: {
          projectName: 'meta-fail-game',
          templateId: 'default',
          outputPath,
          genesisVersion: '0.3.0',
          skipValidation: true,
        },
      });

      expect(result.report?.metadataWriteError).toBe('metadata unavailable');
      const readme = await readFile(join(outputPath, 'README.md'), 'utf8');
      expect(readme).toContain('MetaFailGame');
      expect(result.created).toBeGreaterThan(0);
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });

  it('generates identical file structure for v1.0 and v1.1 default templates', async () => {
    const filesystem = new NodeFilesystem();
    const templateBundle = createTemplateEngineBundle({
      filesystem,
      templatesRoot,
      genesisVersion: '0.3.0',
    });
    const validationService = createDefaultValidationService(filesystem);
    const defaultOutput = await mkdtemp(join(tmpdir(), 'genesis-v11-'));
    const v1Output = await mkdtemp(join(tmpdir(), 'genesis-v10-'));

    const pipeline = createDefaultGenerationPipeline({
      filesystem,
      templateProvider: templateBundle.provider,
      templateRenderer: templateBundle.renderer,
      contextAssembler: templateBundle.contextAssembler,
      validationService,
    });

    try {
      await pipeline.run({
        request: {
          projectName: 'parity-game',
          templateId: 'default',
          outputPath: defaultOutput,
          genesisVersion: '0.3.0',
          skipValidation: true,
        },
      });

      await pipeline.run({
        request: {
          projectName: 'parity-game',
          templateId: 'v1-fixture',
          outputPath: v1Output,
          genesisVersion: '0.3.0',
          skipValidation: true,
        },
      });

      const defaultFiles = await listRelativeFiles(defaultOutput);
      const v1Files = await listRelativeFiles(v1Output);

      expect(v1Files).toEqual(defaultFiles);
    } finally {
      await rm(defaultOutput, { recursive: true, force: true });
      await rm(v1Output, { recursive: true, force: true });
    }
  });
});
