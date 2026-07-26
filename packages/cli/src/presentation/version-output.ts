import { FRAMEWORK_NAME } from '@genesis/shared';
import { getCliVersion } from '../version.js';

export interface VersionOutputOptions {
  readonly useColor: boolean;
}

export function formatVersionOutput(options: VersionOutputOptions): string {
  const version = getCliVersion();
  const nodeVersion = process.version;
  const line = `genesis v${version} (node ${nodeVersion})`;

  if (!options.useColor) {
    return line;
  }

  return `${FRAMEWORK_NAME} — ${line}`;
}
