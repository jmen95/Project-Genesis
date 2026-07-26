import { EXIT_VALIDATION_FAILURE, GenesisError } from '@genesis/core';

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
