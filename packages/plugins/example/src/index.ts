import type { HookExecutionContext, PluginContext } from '@genesis/plugin-kernel';
import type { IValidationRule } from '@genesis/validator';

const manifest = {
  name: '@genesis/plugin-example',
  version: '0.1.0',
  apiVersion: '1.x',
  genesisVersion: '^0.1.0',
  description: 'Reference plugin for Sprint 4 kernel validation',
  main: './dist/index.js',
  capabilities: ['template', 'validator', 'hook'] as const,
  templates: 'templates',
};

const exampleRule: IValidationRule<string> = {
  id: '@genesis/plugin-example:EX-001',
  async validate(rootPath: string) {
    if (rootPath.includes('skip-example-rule')) {
      return [
        {
          ruleId: '@genesis/plugin-example:EX-001',
          severity: 'warning' as const,
          message: 'Example plugin validation warning',
        },
      ];
    }
    return [];
  },
};

export const plugin = {
  manifest,

  async onLoad(_context: PluginContext): Promise<void> {
    return;
  },

  register(context: PluginContext): void {
    context.registerTemplate({
      templateId: 'example-stub',
      version: '0.1.0',
      description: 'Minimal example template from plugin',
      priority: 50,
    });

    context.registerValidator({
      ruleId: '@genesis/plugin-example:EX-001',
      kind: 'project-output',
      rule: exampleRule,
      priority: 200,
    });

    context.registerHook({
      hookId: '@genesis/plugin-example:after-create',
      point: 'afterProjectCreate',
      priority: 100,
      handler: (hookContext: HookExecutionContext) => {
        context.logger.info(
          `Example plugin hook afterProjectCreate: ${String(hookContext.payload['projectName'] ?? '')}`,
        );
      },
    });
  },
};

export default plugin;
