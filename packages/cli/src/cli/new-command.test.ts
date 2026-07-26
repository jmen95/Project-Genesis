import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { runGenesisCli } from '../cli/program.js';
import type { CliOutput } from '../cli/program.js';

function createCaptureStream(): { stream: CliOutput; getOutput: () => string } {
  let output = '';
  const stream: CliOutput = {
    isTTY: false,
    write(chunk: string) {
      output += chunk;
    },
  };
  return {
    stream,
    getOutput: () => output,
  };
}

function getTemplatesRoot(): string {
  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  return resolve(currentDir, '..', '..', '..', 'templates');
}

function restoreTemplatesRoot(previous: string | undefined): void {
  if (previous === undefined) {
    process.env['GENESIS_TEMPLATES_ROOT'] = undefined;
  } else {
    process.env['GENESIS_TEMPLATES_ROOT'] = previous;
  }
}

describe('genesis new command', () => {
  const templatesRoot = getTemplatesRoot();
  const previousTemplatesRoot = process.env['GENESIS_TEMPLATES_ROOT'];

  it('prints dry-run plan without writing files', async () => {
    process.env['GENESIS_TEMPLATES_ROOT'] = templatesRoot;
    const outputDir = await mkdtemp(join(tmpdir(), 'genesis-new-dry-'));
    const { stream, getOutput } = createCaptureStream();

    try {
      const exitCode = await runGenesisCli({
        argv: ['node', 'genesis', 'new', 'my-game', '--output', outputDir, '--dry-run'],
        stdout: stream,
        useColor: false,
      });

      expect(exitCode).toBe(0);
      expect(getOutput()).toContain('dry-run');
      expect(getOutput()).toContain('README.md');
    } finally {
      await rm(outputDir, { recursive: true, force: true });
      restoreTemplatesRoot(previousTemplatesRoot);
    }
  });

  it('rejects invalid project names with exit code 2', async () => {
    process.env['GENESIS_TEMPLATES_ROOT'] = templatesRoot;
    const { stream } = createCaptureStream();

    const exitCode = await runGenesisCli({
      argv: ['node', 'genesis', 'new', 'My-Game'],
      stdout: stream,
      useColor: false,
    });

    expect(exitCode).toBe(2);

    restoreTemplatesRoot(previousTemplatesRoot);
  });

  it('creates project structure with rendered variables', async () => {
    process.env['GENESIS_TEMPLATES_ROOT'] = templatesRoot;
    const outputDir = await mkdtemp(join(tmpdir(), 'genesis-new-create-'));
    const projectDir = join(outputDir, 'ocean-quest');
    const { stream } = createCaptureStream();

    try {
      const exitCode = await runGenesisCli({
        argv: ['node', 'genesis', 'new', 'ocean-quest', '--output', projectDir],
        stdout: stream,
        useColor: false,
      });

      expect(exitCode).toBe(0);

      const readme = await readFile(join(projectDir, 'README.md'), 'utf8');
      const config = await readFile(join(projectDir, 'genesis.config.ts'), 'utf8');

      expect(readme).toContain('OceanQuest');
      expect(config).toContain("name: 'ocean-quest'");
    } finally {
      await rm(outputDir, { recursive: true, force: true });
      restoreTemplatesRoot(previousTemplatesRoot);
    }
  });

  it('returns exit code 3 for non-empty output without force', async () => {
    process.env['GENESIS_TEMPLATES_ROOT'] = templatesRoot;
    const outputDir = await mkdtemp(join(tmpdir(), 'genesis-new-conflict-'));
    const projectDir = join(outputDir, 'blocked-game');
    const { stream } = createCaptureStream();

    try {
      await runGenesisCli({
        argv: ['node', 'genesis', 'new', 'blocked-game', '--output', projectDir],
        stdout: stream,
        useColor: false,
      });

      const exitCode = await runGenesisCli({
        argv: ['node', 'genesis', 'new', 'blocked-game', '--output', projectDir],
        stdout: stream,
        useColor: false,
      });

      expect(exitCode).toBe(3);
    } finally {
      await rm(outputDir, { recursive: true, force: true });
      restoreTemplatesRoot(previousTemplatesRoot);
    }
  });
});
