import { join } from 'node:path';

import type { PluginHost } from '@genesis/plugin-kernel';
import type { GenerationResult, IScaffoldingService } from '@genesis/scaffolding';

import { getCliVersion } from '../version.js';

export interface CreateProjectCommand {
  readonly projectName: string;
  readonly templateId?: string;
  readonly outputPath?: string;
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly skipValidation?: boolean;
  readonly author?: string;
  readonly license?: string;
}

export class CreateProjectUseCase {
  private readonly scaffolding: IScaffoldingService;
  private readonly pluginHost: PluginHost;

  constructor(scaffolding: IScaffoldingService, pluginHost: PluginHost) {
    this.scaffolding = scaffolding;
    this.pluginHost = pluginHost;
  }

  async execute(command: CreateProjectCommand): Promise<GenerationResult> {
    const outputPath = command.outputPath ?? join(process.cwd(), command.projectName);
    const genesisVersion = getCliVersion();
    const hookRunner = this.pluginHost.getHookRunner();

    await hookRunner.runAbortable(
      'beforeProjectCreate',
      {
        projectName: command.projectName,
        templateId: command.templateId ?? 'default',
        outputPath,
      },
      genesisVersion,
    );

    const result = await this.scaffolding.createProject({
      projectName: command.projectName,
      templateId: command.templateId ?? 'default',
      outputPath,
      dryRun: command.dryRun ?? false,
      force: command.force ?? false,
      skipValidation: command.skipValidation ?? false,
      genesisVersion,
      license: command.license ?? 'MIT',
      ...(command.author !== undefined ? { author: command.author } : {}),
      ...(process.env['GENESIS_AUTHOR'] !== undefined
        ? { author: process.env['GENESIS_AUTHOR'] }
        : {}),
    });

    try {
      await hookRunner.run(
        'afterProjectCreate',
        {
          projectName: command.projectName,
          templateId: command.templateId ?? 'default',
          outputPath,
          created: result.created,
        },
        genesisVersion,
      );
    } catch {
      // after hooks must not fail generation
    }

    return result;
  }
}
