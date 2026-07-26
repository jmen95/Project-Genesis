#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function usage(): string {
  return `Usage: create-genesis-plugin <plugin-directory> [--id @scope/name] [--name "Plugin title"]

Creates a minimal Genesis plugin using @genesis/plugin-sdk.`;
}

function parseArgs(argv: string[]): {
  readonly targetDir: string;
  readonly pluginId: string;
  readonly description: string;
} {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
  }

  const targetDir = args[0] ?? '';
  let pluginId = '@acme/my-plugin';
  let description = 'My Genesis plugin';

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--id') {
      pluginId = args[index + 1] ?? pluginId;
      index += 1;
    } else if (arg === '--name') {
      description = args[index + 1] ?? description;
      index += 1;
    }
  }

  return { targetDir, pluginId, description };
}

function renderTemplate(content: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    content,
  );
}

function main(): void {
  const { targetDir, pluginId, description } = parseArgs(process.argv);
  const destination = resolve(process.cwd(), targetDir);

  if (existsSync(destination)) {
    process.stderr.write(`Target directory already exists: ${destination}\n`);
    process.exit(1);
  }

  const templateRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'template');
  const packageName = pluginId.split('/')[1] ?? 'my-plugin';
  const values = {
    PLUGIN_ID: pluginId,
    PLUGIN_DESCRIPTION: description,
    PACKAGE_NAME: packageName,
  };

  mkdirSync(destination, { recursive: true });
  cpSync(templateRoot, destination, { recursive: true });

  const filesToRender = ['package.json', 'genesis.plugin.json', 'src/index.ts', 'README.md'];

  for (const relativePath of filesToRender) {
    const filePath = join(destination, relativePath);
    const content = readFileSync(join(templateRoot, relativePath), 'utf8');
    writeFileSync(filePath, renderTemplate(content, values));
  }

  process.stdout.write(`Created Genesis plugin at ${destination}\n`);
  process.stdout.write(`Next: cd ${targetDir} && pnpm install && pnpm build\n`);
}

main();
