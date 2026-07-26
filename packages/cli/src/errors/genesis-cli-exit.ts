import type { ExitCode } from '@genesis/core';

export class GenesisCliExit extends Error {
  readonly exitCode: ExitCode;

  constructor(exitCode: ExitCode, message?: string) {
    super(message ?? `Genesis CLI exited with code ${exitCode}`);
    this.name = 'GenesisCliExit';
    this.exitCode = exitCode;
  }
}
