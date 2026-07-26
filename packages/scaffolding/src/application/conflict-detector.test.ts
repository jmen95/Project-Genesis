import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { NodeFilesystem } from '@genesis/core';

import { OutputConflictError } from '../domain/scaffolding.errors.js';
import { ConflictDetector } from './conflict-detector.js';

describe('ConflictDetector', () => {
  it('allows writing to a non-existent directory', async () => {
    const detector = new ConflictDetector(new NodeFilesystem());
    await expect(
      detector.assertWritableOutput('/tmp/genesis-nonexistent-dir-xyz', false),
    ).resolves.toBeUndefined();
  });

  it('throws when directory exists and is not empty', async () => {
    const filesystem = new NodeFilesystem();
    const detector = new ConflictDetector(filesystem);
    const outputPath = await mkdtemp(join(tmpdir(), 'genesis-conflict-'));

    try {
      await writeFile(join(outputPath, 'existing.txt'), 'content', 'utf8');
      await expect(detector.assertWritableOutput(outputPath, false)).rejects.toBeInstanceOf(
        OutputConflictError,
      );
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });

  it('allows force overwrite for non-empty directories', async () => {
    const filesystem = new NodeFilesystem();
    const detector = new ConflictDetector(filesystem);
    const outputPath = await mkdtemp(join(tmpdir(), 'genesis-conflict-force-'));

    try {
      await writeFile(join(outputPath, 'existing.txt'), 'content', 'utf8');
      await expect(detector.assertWritableOutput(outputPath, true)).resolves.toBeUndefined();
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });
});
