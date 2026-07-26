import { FRAMEWORK_NAME } from '@genesis/shared';

export function getExtendedHelpText(): string {
  return [
    '',
    'COMMANDS',
    '  new <name>              Scaffold a new project',
    '  create <name>           Scaffold a new project (alias — coming soon)',
    '  validate                Run architecture and standards checks',
    '  generate <type> [name]  Generate a module within the project',
    '  config                  Manage Genesis configuration',
    '  plugin                  Manage plugins',
    '',
    'EXAMPLES',
    '  genesis doctor',
    '  genesis --version',
    '  genesis --help',
    '',
    'DOCUMENTATION',
    '  https://github.com/project-genesis/project-genesis',
    `  ${FRAMEWORK_NAME} CLI specification: specs/001-cli/`,
    '',
  ].join('\n');
}
