import { Command, CommanderError } from 'commander';

import { EXIT_SUCCESS } from '@genesis/core';
import { FRAMEWORK_NAME } from '@genesis/shared';

import { collectDoctorReport, formatDoctorOutput } from '../presentation/doctor-output.js';
import { getExtendedHelpText } from '../presentation/help-output.js';
import { formatVersionOutput } from '../presentation/version-output.js';
import { getCliVersion } from '../version.js';

export interface CliOutput {
  write(chunk: string): void;
  isTTY: boolean;
}

export interface CliRuntimeOptions {
  readonly argv?: readonly string[];
  readonly stdout?: CliOutput;
  readonly useColor?: boolean;
}

function isColorEnabled(stdout: CliOutput, override?: boolean): boolean {
  if (override !== undefined) {
    return override;
  }
  if (process.env['NO_COLOR'] !== undefined) {
    return false;
  }
  return stdout.isTTY;
}

export function createGenesisProgram(options?: CliRuntimeOptions): Command {
  const stdout = options?.stdout ?? process.stdout;
  const useColor = isColorEnabled(stdout, options?.useColor);

  const program = new Command();

  program.configureOutput({
    writeOut: (str) => {
      stdout.write(str);
    },
    writeErr: (str) => {
      stdout.write(str);
    },
  });

  program
    .name('genesis')
    .description(`${FRAMEWORK_NAME} — AI-native game development framework`)
    .version(formatVersionOutput({ useColor: false }), '-V, --version', 'Show CLI version')
    .helpOption('-h, --help', 'Show help')
    .addHelpText('after', getExtendedHelpText());

  program
    .command('doctor')
    .description('Print environment and prerequisite information')
    .action(() => {
      const report = collectDoctorReport();
      stdout.write(`${formatDoctorOutput(report, { useColor })}\n`);
    });

  program.exitOverride();

  return program;
}

export async function runGenesisCli(options?: CliRuntimeOptions): Promise<number> {
  const argv = options?.argv ?? process.argv;
  const stdout = options?.stdout ?? process.stdout;
  const program = createGenesisProgram(options);

  try {
    await program.parseAsync(argv);
    return EXIT_SUCCESS;
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.code === 'commander.helpDisplayed' || error.code === 'commander.version') {
        return EXIT_SUCCESS;
      }
    }

    const message = error instanceof Error ? error.message : String(error);
    stdout.write(`Error: ${message}\nRun genesis --help for usage.\n`);
    return 1;
  }
}
