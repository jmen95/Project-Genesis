import { EXIT_INVALID_ARGUMENT, EXIT_SUCCESS, type ExitCode, GenesisError } from '@genesis/core';
import type { GenerationResult } from '@genesis/scaffolding';
import { validateProjectName } from '@genesis/shared';

import { formatGenerationReport } from '../../presentation/generation-report-formatter.js';
import type { CreateProjectCommand, CreateProjectUseCase } from '../create-project.use-case.js';

export interface NewProjectHandlerInput {
  readonly projectName: string;
  readonly templateId?: string;
  readonly outputPath?: string;
  readonly dryRun?: boolean;
  readonly force?: boolean;
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
    const validation = validateProjectName(input.projectName);
    if (!validation.ok) {
      return {
        exitCode: EXIT_INVALID_ARGUMENT,
        output: `Error: ${validation.error}\n`,
      };
    }

    const command: CreateProjectCommand = {
      projectName: validation.value,
      ...(input.templateId !== undefined ? { templateId: input.templateId } : {}),
      ...(input.outputPath !== undefined ? { outputPath: input.outputPath } : {}),
      ...(input.dryRun !== undefined ? { dryRun: input.dryRun } : {}),
      ...(input.force !== undefined ? { force: input.force } : {}),
    };

    try {
      const result = await this.useCase.execute(command);
      return {
        exitCode: EXIT_SUCCESS,
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
