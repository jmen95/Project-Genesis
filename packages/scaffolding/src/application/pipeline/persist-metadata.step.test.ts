import { describe, expect, it, vi } from 'vitest';

import type { IMetadataWriter } from '../../domain/metadata-writer.interface.js';
import { PersistMetadataStep } from './persist-metadata.step.js';

describe('PersistMetadataStep', () => {
  const baseInput = {
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
    results: [{ outputPath: '/tmp/my-game/README.md', action: 'created' as const, size: 10 }],
  };

  it('writes metadata on success', async () => {
    const metadataWriter: IMetadataWriter = {
      write: vi.fn().mockResolvedValue(undefined),
    };

    const step = new PersistMetadataStep(metadataWriter);
    const output = await step.execute(baseInput);

    expect(metadataWriter.write).toHaveBeenCalledOnce();
    expect(output.report.metadata?.templateId).toBe('default');
    expect(output.report.metadataWriteError).toBeUndefined();
  });

  it('records metadata errors without throwing', async () => {
    const metadataWriter: IMetadataWriter = {
      write: vi.fn().mockRejectedValue(new Error('disk full')),
    };

    const step = new PersistMetadataStep(metadataWriter);
    const output = await step.execute(baseInput);

    expect(output.report.metadataWriteError).toBe('disk full');
    expect(output.report.metadata).toBeUndefined();
  });

  it('skips metadata for dry-run', async () => {
    const metadataWriter: IMetadataWriter = {
      write: vi.fn(),
    };

    const step = new PersistMetadataStep(metadataWriter);
    const output = await step.execute({
      ...baseInput,
      plan: { ...baseInput.plan, dryRun: true },
    });

    expect(metadataWriter.write).not.toHaveBeenCalled();
    expect(output.report).toEqual({});
  });
});
