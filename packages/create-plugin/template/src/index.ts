import { defineHook, definePlugin } from '@genesis/plugin-sdk';

export default definePlugin({
  id: '{{PLUGIN_ID}}',
  version: '0.1.0',
  description: '{{PLUGIN_DESCRIPTION}}',
  genesisVersion: '^0.1.0',

  hooks: {
    afterProjectCreate: defineHook({
      id: 'ready',
      handler: ({ logger }) => {
        logger.info('Plugin loaded after project create');
      },
    }),
  },
});
