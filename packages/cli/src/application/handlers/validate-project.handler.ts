import { EXIT_INVALID_ARGUMENT, type ExitCode } from '@genesis/core';

import { formatValidationReport } from '../../presentation/validation-report-formatter.js';
import type {
  ValidateProjectCommand,
  ValidateProjectUseCase,
} from '../validate-project.use-case.js';

export interface ValidateProjectHandlerInput {
  readonly projectPath?: string;
}

export interface ValidateProjectHandlerResult {
  readonly exitCode: ExitCode;
  readonly output: string;
}

export class ValidateProjectHandler {
  private readonly useCase: ValidateProjectUseCase;

  constructor(useCase: ValidateProjectUseCase) {
    this.useCase = useCase;
  }

  async handle(input: ValidateProjectHandlerInput): Promise<ValidateProjectHandlerResult> {
    const command: ValidateProjectCommand = {
      ...(input.projectPath !== undefined ? { projectPath: input.projectPath } : {}),
    };

    const result = await this.useCase.execute(command);
    return {
      exitCode: result.exitCode,
      output: formatValidationReport(result.report, command.projectPath),
    };
  }
}
