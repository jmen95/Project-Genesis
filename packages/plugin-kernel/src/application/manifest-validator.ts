export const PLUGIN_ID_PATTERN = /^@[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;

export function validatePluginId(id: string): string | undefined {
  const trimmed = id.trim();
  if (!PLUGIN_ID_PATTERN.test(trimmed)) {
    return 'Plugin id must match @scope/name (kebab-case)';
  }
  return undefined;
}

export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version);
}

export function satisfiesGenesisVersion(range: string, genesisVersion: string): boolean {
  const trimmed = range.trim();
  if (trimmed.startsWith('^')) {
    const base = trimmed.slice(1);
    const [major] = base.split('.');
    const [currentMajor] = genesisVersion.split('.');
    return major === currentMajor && compareSemver(genesisVersion, base) >= 0;
  }
  if (trimmed.startsWith('>=')) {
    return compareSemver(genesisVersion, trimmed.slice(2).trim()) >= 0;
  }
  return compareSemver(genesisVersion, trimmed) >= 0;
}

function compareSemver(left: string, right: string): number {
  const parse = (value: string): number[] =>
    value
      .split('.')
      .map((part) => Number.parseInt(part.replace(/[^0-9].*$/, ''), 10))
      .slice(0, 3);

  const leftParts = parse(left);
  const rightParts = parse(right);

  for (let index = 0; index < 3; index += 1) {
    const diff = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}
