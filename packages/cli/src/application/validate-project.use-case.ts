import { resolve } from 'node:path';

import { EXIT_ERROR, EXIT_INVALID_ARGUMENT, EXIT_SUCCESS, type ExitCode } from '@genesis/core';
import type { IFilesystem } from '@genesis/core';
import type { PluginHost } from '@genesis/plugin-kernel';
import type { IValidationService } from '@genesis/validator';

import { getCliVersion } from '../version.js';

export interface ValidateProjectCommand {
  readonly projectPath?: string;
}

export class ValidateProjectUseCase {
  private readonly validationService: IValidationService;
  private readonly filesystem: IFilesystem;
  private readonly pluginHost: PluginHost;

  constructor(
    validationService: IValidationService,
    filesystem: IFilesystem,
    pluginHost: PluginHost,
  ) {
    this.validationService = validationService;
    this.filesystem = filesystem;
    this.pluginHost = pluginHost;
  }

  async execute(command: ValidateProjectCommand): Promise<{
    exitCode: ExitCode;
    report: import('@genesis/shared').ValidationReport;
  }> {
    const projectPath = resolve(command.projectPath ?? process.cwd());
    const genesisVersion = getCliVersion();
    const hookRunner = this.pluginHost.getHookRunner();

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

    await hookRunner.runAbortable('beforeValidation', { projectPath }, genesisVersion);

    const report = await this.validationService.validate({
      kind: 'project-output',
      rootPath: projectPath,
    });

    try {
      await hookRunner.run(
        'afterValidation',
        { projectPath, success: report.success },
        genesisVersion,
      );
    } catch {
      // after hooks are non-fatal
    }

    return {
      exitCode: report.success ? EXIT_SUCCESS : EXIT_ERROR,
      report,
    };
  }
}
