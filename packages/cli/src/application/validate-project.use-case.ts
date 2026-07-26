import { resolve } from 'node:path';

import { EXIT_ERROR, EXIT_INVALID_ARGUMENT, EXIT_SUCCESS, type ExitCode } from '@genesis/core';
import type { IFilesystem } from '@genesis/core';
import type { IValidationService } from '@genesis/validator';

export interface ValidateProjectCommand {
  readonly projectPath?: string;
}

export class ValidateProjectUseCase {
  private readonly validationService: IValidationService;
  private readonly filesystem: IFilesystem;

  constructor(validationService: IValidationService, filesystem: IFilesystem) {
    this.validationService = validationService;
    this.filesystem = filesystem;
  }

  async execute(command: ValidateProjectCommand): Promise<{
    exitCode: ExitCode;
    report: import('@genesis/shared').ValidationReport;
  }> {
    const projectPath = resolve(command.projectPath ?? process.cwd());

    if (!(await this.filesystem.exists(projectPath))) {
      return {
        exitCode: EXIT_INVALID_ARGUMENT,
        report: {
          success: false,
          issues: [
            {
              ruleId: 'PATH-001',
              severity: 'error',
              message: `Project path does not exist: ${projectPath}`,
              path: projectPath,
            },
          ],
          errorCount: 1,
          warningCount: 0,
        },
      };
    }

    const report = await this.validationService.validate({
      kind: 'project-output',
      rootPath: projectPath,
    });

    return {
      exitCode: report.success ? EXIT_SUCCESS : EXIT_ERROR,
      report,
    };
  }
}
