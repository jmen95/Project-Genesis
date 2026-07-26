import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface PackageJson {
  readonly version: string;
}

let cachedVersion: string | undefined;

export function getCliVersion(): string {
  if (cachedVersion) {
    return cachedVersion;
  }

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const packageJsonPath = join(currentDir, '..', 'package.json');
  const raw = readFileSync(packageJsonPath, 'utf8');
  const parsed = JSON.parse(raw) as PackageJson;
  cachedVersion = parsed.version;
  return cachedVersion;
}
