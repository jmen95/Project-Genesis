import {
  EXIT_ERROR,
  EXIT_INVALID_ARGUMENT,
  EXIT_SUCCESS,
  type ExitCode,
  GenesisError,
} from '@genesis/core';
import type { GenerationResult } from '@genesis/scaffolding';

import { formatGenerationReport } from '../../presentation/generation-report-formatter.js';
import type { CreateProjectCommand, CreateProjectUseCase } from '../create-project.use-case.js';

export interface NewProjectHandlerInput {
  readonly projectName: string;
  readonly templateId?: string;
  readonly outputPath?: string;
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly skipValidation?: boolean;
}

export interface NewProjectHandlerResult {
  readonly exitCode: ExitCode;
  readonly output: string;
  readonly result?: GenerationResult;
}

export class NewProjectHandler {
  private readonly useCase: CreateProjectUseCase;

  constructor(useCase: CreateProjectUseCase) {
    this.useCase = useCase;
  }

  async handle(input: NewProjectHandlerInput): Promise<NewProjectHandlerResult> {
    const command: CreateProjectCommand = {
      projectName: input.projectName,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.outputPath !== undefined ? { outputPath: input.outputPath } : {}),
      ...(input.dryRun !== undefined ? { dryRun: input.dryRun } : {}),
      ...(input.force !== undefined ? { force: input.force } : {}),
      ...(input.skipValidation !== undefined ? { skipValidation: input.skipValidation } : {}),
    };

    try {
      const result = await this.useCase.execute(command);
      const exitCode =
        result.validation && result.validation.errorCount > 0 ? EXIT_ERROR : EXIT_SUCCESS;

      return {
        exitCode,
        output: formatGenerationReport(result),
        result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const exitCode = error instanceof GenesisError ? error.exitCode : EXIT_INVALID_ARGUMENT;
      return {
        exitCode,
        output: `Error: ${message}\n`,
      };
    }
  }
}
