import { defineHook, definePlugin, defineTemplate, defineValidator } from '@genesis/plugin-sdk';

export default definePlugin({
  id: '@genesis/plugin-example',
  version: '0.1.0',
  description: 'Official Genesis SDK reference plugin',
  genesisVersion: '^0.1.0',

  templates: [
    defineTemplate({
      id: 'example-stub',
      version: '0.1.0',
      description: 'Minimal example template from plugin',
      priority: 50,
    }),
  ],

  validators: [
    defineValidator({
      id: 'EX-001',
      kind: 'project-output',
      priority: 200,
      validate: (target) => {
        if (target.kind !== 'project-output') {
          return [];
        }
        if (target.rootPath.includes('skip-example-rule')) {
          return [
            {
              severity: 'warning',
              message: 'Example plugin validation warning',
            },
          ];
        }
        return [];
      },
    }),
  ],

  hooks: {
    afterProjectCreate: defineHook({
      id: 'after-create',
      priority: 100,
      handler: ({ payload, logger }) => {
        logger.info(
          `Example plugin hook afterProjectCreate: ${String(payload['projectName'] ?? '')}`,
        );
      },
    }),
  },
});
