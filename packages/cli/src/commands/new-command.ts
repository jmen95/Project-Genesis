import type { Command } from 'commander';

import type { NewProjectHandler } from '../application/handlers/new-project.handler.js';
import type { CliOutput } from '../cli/program.js';
import { GenesisCliExit } from '../errors/genesis-cli-exit.js';

export interface NewCommandDeps {
  readonly handler: NewProjectHandler;
  readonly stdout: CliOutput;
}

export function registerNewCommand(program: Command, deps: NewCommandDeps): void {
  program
    .command('new')
    .description('Scaffold a new project from a template')
    .argument('<project-name>', 'Project name (kebab-case)')
    .option('-t, --template <id>', 'Template id', 'default')
    .option('-o, --output <path>', 'Output directory')
    .option('--dry-run', 'Preview generation plan without writing files', false)
    .option('--force', 'Overwrite existing output directory', false)
    .option('--skip-validation', 'Skip post-generation validation', false)
    .action(async (projectName: string, options: NewCommandOptions) => {
      const result = await deps.handler.handle({
        projectName,
        templateId: options.template,
        ...(options.output !== undefined ? { outputPath: options.output } : {}),
        dryRun: options.dryRun,
        force: options.force,
        skipValidation: options.skipValidation,
      });

      deps.stdout.write(result.output);

      if (result.exitCode !== 0) {
        throw new GenesisCliExit(result.exitCode);
      }
    });
}

interface NewCommandOptions {
  readonly template: string;
  readonly output?: string;
  readonly dryRun: boolean;
  readonly force: boolean;
  readonly skipValidation: boolean;
}
