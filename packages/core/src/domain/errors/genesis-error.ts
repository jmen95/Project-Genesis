import type { ExitCode } from './exit-codes.js';
import { EXIT_ERROR } from './exit-codes.js';

export interface GenesisErrorOptions {
  readonly code: string;
  readonly message: string;
  readonly exitCode?: ExitCode;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly cause?: Error;
}

export class GenesisError extends Error {
  readonly code: string;
  readonly exitCode: ExitCode;
  readonly details: Readonly<Record<string, unknown>> | undefined;

  constructor(options: GenesisErrorOptions) {
    super(options.message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'GenesisError';
    this.code = options.code;
    this.exitCode = options.exitCode ?? EXIT_ERROR;
    this.details = options.details;
  }
}

export class ConfigurationError extends GenesisError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(
      details !== undefined
        ? { code: 'CONFIG_ERROR', message, details }
        : { code: 'CONFIG_ERROR', message },
    );
    this.name = 'ConfigurationError';
  }
}

export class FilesystemError extends GenesisError {
  constructor(message: string, cause?: Error) {
    super(
      cause !== undefined
        ? { code: 'FILESYSTEM_ERROR', message, cause }
        : { code: 'FILESYSTEM_ERROR', message },
    );
    this.name = 'FilesystemError';
  }
}
