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

describe('genesis cli program', () => {
  it('prints help when --help is passed', async () => {
    const { stream, getOutput } = createCaptureStream();
    const exitCode = await runGenesisCli({
      argv: ['node', 'genesis', '--help'],
      stdout: stream,
      useColor: false,
    });

    expect(exitCode).toBe(0);
    expect(getOutput()).toContain('Usage:');
    expect(getOutput()).toContain('doctor');
  });

  it('prints version when --version is passed', async () => {
    const { stream, getOutput } = createCaptureStream();
    const exitCode = await runGenesisCli({
      argv: ['node', 'genesis', '--version'],
      stdout: stream,
      useColor: false,
    });

    expect(exitCode).toBe(0);
    expect(getOutput()).toContain('genesis v');
  });

  it('runs doctor command', async () => {
    const { stream, getOutput } = createCaptureStream();
    const exitCode = await runGenesisCli({
      argv: ['node', 'genesis', 'doctor'],
      stdout: stream,
      useColor: false,
    });

    expect(exitCode).toBe(0);
    expect(getOutput()).toContain('Environment');
    expect(getOutput()).toContain('Node.js');
  });
});
