import { EXIT_INVALID_ARGUMENT, EXIT_VALIDATION_FAILURE, GenesisError } from '@genesis/core';

export class OutputConflictError extends GenesisError {
  constructor(outputPath: string) {
    super({
      code: 'OUTPUT_CONFLICT',
      message: `Output directory is not empty: ${outputPath}. Use --force to overwrite.`,
      exitCode: EXIT_VALIDATION_FAILURE,
      details: { outputPath },
    });
    this.name = 'OutputConflictError';
  }
}

export class InputValidationError extends GenesisError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super({
      code: 'INPUT_VALIDATION',
      message,
      exitCode: EXIT_INVALID_ARGUMENT,
      ...(details !== undefined ? { details } : {}),
    });
    this.name = 'InputValidationError';
  }
}
