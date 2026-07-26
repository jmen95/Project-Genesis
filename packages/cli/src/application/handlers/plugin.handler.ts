import type { PluginHost, PluginRecord } from '@genesis/plugin-kernel';

export interface ListPluginsHandlerResult {
  readonly output: string;
  readonly exitCode: number;
}

export class ListPluginsHandler {
  constructor(private readonly pluginHost: PluginHost) {}

  handle(): ListPluginsHandlerResult {
    const plugins = this.pluginHost.listPlugins();
    const lines: string[] = [];
    const registered = plugins.filter((plugin) => plugin.state === 'registered').length;
    const failed = plugins.filter((plugin) => plugin.state === 'failed').length;

    lines.push(
      `Plugins — ${plugins.length} discovered, ${registered} registered, ${failed} failed`,
    );
    lines.push('');
    lines.push(`${'  ID'.padEnd(36)}${'Version'.padEnd(12)}${'State'.padEnd(14)}Capabilities`);
    lines.push(`  ${'-'.repeat(70)}`);

    for (const plugin of plugins) {
      lines.push(
        `  ${plugin.id.padEnd(34)}${plugin.manifest.version.padEnd(12)}${plugin.state.padEnd(14)}${plugin.manifest.capabilities.join(', ')}`,
      );
    }

    return { output: `${lines.join('\n')}\n`, exitCode: 0 };
  }
}

export interface GetPluginInfoHandlerResult {
  readonly output: string;
  readonly exitCode: number;
}

export class GetPluginInfoHandler {
  constructor(private readonly pluginHost: PluginHost) {}

  handle(pluginId: string): GetPluginInfoHandlerResult {
    const plugin = this.pluginHost.getPlugin(pluginId);
    if (!plugin) {
      return { output: `Error: Plugin not found: ${pluginId}\n`, exitCode: 2 };
    }

    return {
      output: `${formatPluginInfo(plugin)}\n`,
      exitCode: plugin.state === 'failed' ? 3 : 0,
    };
  }
}

function formatPluginInfo(plugin: PluginRecord): string {
  const lines: string[] = [
    `Plugin: ${plugin.id}`,
    `Version: ${plugin.manifest.version}`,
    `API Version: ${plugin.manifest.apiVersion}`,
    `Genesis: ${plugin.manifest.genesisVersion}`,
    `State: ${plugin.state}`,
    `Path: ${plugin.pluginRoot}`,
    `Capabilities: ${plugin.manifest.capabilities.join(', ')}`,
    '',
    'Contributions:',
    `  Templates:  ${plugin.contributions.templates.map((item) => item.templateId).join(', ') || '(none)'}`,
    `  Validators: ${plugin.contributions.validators.map((item) => item.ruleId).join(', ') || '(none)'}`,
    `  Hooks:      ${plugin.contributions.hooks.map((item) => item.hookId).join(', ') || '(none)'}`,
  ];

  if (plugin.errors.length > 0) {
    lines.push('', 'Errors:');
    for (const error of plugin.errors) {
      lines.push(`  [${error.stage}] ${error.reason}`);
    }
  }

  return lines.join('\n');
}
