import type { GenesisPlugin } from '@genesis/plugin-kernel';

import { toGenesisPlugin } from './internal/to-genesis-plugin.js';
import type { PluginDefinition } from './types.js';

/**
 * Defines a Genesis plugin using a declarative API.
 *
 * Returns a runtime `GenesisPlugin` adapter that registers contributions with the kernel.
 * Authors should export the result as the default export from the plugin entry module.
 *
 * During `onLoad`, the SDK validates that `genesis.plugin.json` matches:
 * `id`, `version`, and `genesisVersion` from this definition.
 *
 * Capabilities are inferred from declared contributions — do not set them manually.
 *
 * @example
 * ```ts
 * export default definePlugin({
 *   id: '@acme/my-plugin',
 *   version: '1.0.0',
 *   description: 'My plugin',
 *   genesisVersion: '^0.1.0',
 *   hooks: {
 *     afterProjectCreate: defineHook({
 *       id: 'log-create',
 *       handler: ({ logger, payload }) => {
 *         logger.info(`Created ${String(payload['projectName'] ?? '')}`);
 *       },
 *     }),
 *   },
 * });
 * ```
 */
export function definePlugin(definition: PluginDefinition): GenesisPlugin {
  return toGenesisPlugin(definition);
}
