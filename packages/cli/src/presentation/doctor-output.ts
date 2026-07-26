import os from 'node:os';

import { FRAMEWORK_NAME } from '@genesis/shared';
import { getCliVersion } from '../version.js';

export interface DoctorReport {
  readonly framework: string;
  readonly cliVersion: string;
  readonly nodeVersion: string;
  readonly platform: string;
  readonly architecture: string;
  readonly cwd: string;
}

export function collectDoctorReport(): DoctorReport {
  return {
    framework: FRAMEWORK_NAME,
    cliVersion: getCliVersion(),
    nodeVersion: process.version,
    platform: `${os.type()} ${os.release()}`,
    architecture: os.arch(),
    cwd: process.cwd(),
  };
}

export interface DoctorOutputOptions {
  readonly useColor: boolean;
}

export function formatDoctorOutput(report: DoctorReport, options: DoctorOutputOptions): string {
  const lines = [
    options.useColor ? `${FRAMEWORK_NAME} Doctor` : 'Genesis Doctor',
    '',
    'Environment',
    `  Framework     ${report.framework}`,
    `  CLI Version   ${report.cliVersion}`,
    `  Node.js       ${report.nodeVersion}`,
    `  Platform      ${report.platform}`,
    `  Architecture  ${report.architecture}`,
    `  Working Dir   ${report.cwd}`,
    '',
    'Status',
    '  All checks passed (environment information only).',
    '',
    'Run genesis --help for available commands.',
  ];

  return lines.join('\n');
}
