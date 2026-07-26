import type { Command } from 'commander';

import type {
  GetPluginInfoHandler,
  ListPluginsHandler,
} from '../application/handlers/plugin.handler.js';

export function registerPluginCommands(
  program: Command,
  handlers: {
    readonly listPluginsHandler: ListPluginsHandler;
    readonly getPluginInfoHandler: GetPluginInfoHandler;
  },
  stdout: { write(chunk: string): void },
): void {
  const plugin = program.command('plugin').description('Inspect local Genesis plugins');

  plugin
    .command('list')
    .description('List discovered plugins and their state')
    .action(() => {
      const result = handlers.listPluginsHandler.handle();
      stdout.write(result.output);
      process.exitCode = result.exitCode;
    });

  plugin
    .command('info')
    .description('Show plugin details and contributions')
    .argument('<id>', 'Plugin id (e.g. @genesis/plugin-example)')
    .action((id: string) => {
      const result = handlers.getPluginInfoHandler.handle(id);
      stdout.write(result.output);
      process.exitCode = result.exitCode;
    });
}
