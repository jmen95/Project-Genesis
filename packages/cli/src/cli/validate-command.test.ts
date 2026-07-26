import { mkdtemp, rm } from 'node:fs/promises';
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

describe('genesis validate command', () => {
  const templatesRoot = getTemplatesRoot();
  const previousTemplatesRoot = process.env['GENESIS_TEMPLATES_ROOT'];

  it('validates a freshly scaffolded project', async () => {
    process.env['GENESIS_TEMPLATES_ROOT'] = templatesRoot;
    const outputDir = await mkdtemp(join(tmpdir(), 'genesis-validate-'));
    const projectDir = join(outputDir, 'valid-game');
    const { stream } = createCaptureStream();

    try {
      const createExit = await runGenesisCli({
        argv: ['node', 'genesis', 'new', 'valid-game', '--output', projectDir],
        stdout: stream,
        useColor: false,
      });
      expect(createExit).toBe(0);

      const validateExit = await runGenesisCli({
        argv: ['node', 'genesis', 'validate', projectDir],
        stdout: stream,
        useColor: false,
      });

      expect(validateExit).toBe(0);
    } finally {
      await rm(outputDir, { recursive: true, force: true });
      restoreTemplatesRoot(previousTemplatesRoot);
    }
  });

  it('returns exit code 2 for non-existent path', async () => {
    const { stream } = createCaptureStream();
    const exitCode = await runGenesisCli({
      argv: ['node', 'genesis', 'validate', '/tmp/genesis-nonexistent-validate-path'],
      stdout: stream,
      useColor: false,
    });

    expect(exitCode).toBe(2);
  });
});
