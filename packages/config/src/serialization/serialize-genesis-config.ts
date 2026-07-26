import type { GenesisProjectConfig } from '../domain/genesis-project-config.js';

function quote(value: string): string {
  return `'${value.replace(/'/g, "\\'")}'`;
}

function formatStringArray(values: readonly string[]): string {
  return `[${values.map((value) => quote(value)).join(', ')}]`;
}

/**
 * Produces a self-contained genesis.config.ts source string.
 * Generated projects do not import @genesis/config.
 */
export function serializeGenesisConfig(config: GenesisProjectConfig): string {
  const lines: string[] = [
    '/**',
    ` * Genesis project configuration (schemaVersion: ${config.schemaVersion})`,
    ' * Self-contained — no framework imports required.',
    ' */',
    'export default {',
    `  schemaVersion: ${config.schemaVersion},`,
    '  project: {',
    `    name: ${quote(config.project.name)},`,
    `    version: ${quote(config.project.version)},`,
    `    type: ${quote(config.project.type)},`,
  ];

  if (config.project.description !== undefined) {
    lines.push(`    description: ${quote(config.project.description)},`);
  }
  if (config.project.author !== undefined) {
    lines.push(`    author: ${quote(config.project.author)},`);
  }
  if (config.project.license !== undefined) {
    lines.push(`    license: ${quote(config.project.license)},`);
  }

  lines.push('  },', '  engine: {', `    target: ${quote(config.engine.target)},`);

  if (config.engine.version !== undefined) {
    lines.push(`    version: ${quote(config.engine.version)},`);
  }

  lines.push(
    '  },',
    '  platforms: {',
    `    targets: ${formatStringArray(config.platforms.targets)},`,
  );

  if (config.platforms.primary !== undefined) {
    lines.push(`    primary: ${quote(config.platforms.primary)},`);
  }

  lines.push(
    '  },',
    '  modules: {',
    `    enabled: ${formatStringArray(config.modules.enabled)},`,
    '  },',
    '  assets: {',
    `    root: ${quote(config.assets.root)},`,
    '  },',
    '  scripts: {',
    `    root: ${quote(config.scripts.root)},`,
    `    language: ${quote(config.scripts.language)},`,
    '  },',
    '  genesis: {',
    `    version: ${quote(config.genesis.version)},`,
    `    template: ${quote(config.genesis.template)},`,
    `    createdAt: ${quote(config.genesis.createdAt)},`,
    '  },',
    '};',
    '',
  );

  return lines.join('\n');
}
