import type { Command } from 'commander';

import type { ValidateProjectHandler } from '../application/handlers/validate-project.handler.js';
import type { CliOutput } from '../cli/program.js';
import { GenesisCliExit } from '../errors/genesis-cli-exit.js';

export interface ValidateCommandDeps {
  readonly handler: ValidateProjectHandler;
  readonly stdout: CliOutput;
}

export function registerValidateCommand(program: Command, deps: ValidateCommandDeps): void {
  program
    .command('validate')
    .description('Validate project configuration and structure')
    .argument('[path]', 'Project directory', '.')
    .action(async (projectPath: string) => {
      const result = await deps.handler.handle(projectPath === '.' ? {} : { projectPath });

      deps.stdout.write(result.output);

      if (result.exitCode !== 0) {
        throw new GenesisCliExit(result.exitCode);
      }
    });
}
