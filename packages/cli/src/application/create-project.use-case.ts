import { join } from 'node:path';

import type { GenerationResult, IScaffoldingService } from '@genesis/scaffolding';

import { getCliVersion } from '../version.js';

export interface CreateProjectCommand {
  readonly projectName: string;
  readonly templateId?: string;
  readonly outputPath?: string;
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly author?: string;
  readonly license?: string;
}

export class CreateProjectUseCase {
  private readonly scaffolding: IScaffoldingService;

  constructor(scaffolding: IScaffoldingService) {
    this.scaffolding = scaffolding;
  }

  async execute(command: CreateProjectCommand): Promise<GenerationResult> {
    const outputPath = command.outputPath ?? join(process.cwd(), command.projectName);

    return this.scaffolding.createProject({
      projectName: command.projectName,
      templateId: command.templateId ?? 'default',
      outputPath,
      dryRun: command.dryRun ?? false,
      force: command.force ?? false,
      genesisVersion: getCliVersion(),
      license: command.license ?? 'MIT',
      ...(command.author !== undefined ? { author: command.author } : {}),
      ...(process.env['GENESIS_AUTHOR'] !== undefined
        ? { author: process.env['GENESIS_AUTHOR'] }
        : {}),
    });
  }
}
