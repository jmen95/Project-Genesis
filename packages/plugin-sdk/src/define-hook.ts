import { PluginDefinitionError } from './errors/plugin-definition.error.js';
import type { HookDefinition } from './types.js';

const HOOK_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * Declares a hook contribution for a lifecycle point.
 *
 * Hook ids are short names scoped to the plugin. The SDK namespaces them
 * as `@scope/plugin:hook-id` at registration time.
 *
 * @example
 * ```ts
 * hooks: {
 *   afterProjectCreate: defineHook({
 *     id: 'after-create',
 *     handler: ({ payload, logger }) => {
 *       logger.info(`Created ${String(payload['projectName'] ?? '')}`);
 *     },
 *   }),
 * }
 * ```
 */
export function defineHook<TPayload = Readonly<Record<string, unknown>>>(
  definition: HookDefinition<TPayload>,
): HookDefinition<TPayload> {
  if (!HOOK_ID_PATTERN.test(definition.id)) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      `Invalid hook id "${definition.id}". Use kebab-case.`,
      'hooks.id',
    );
  }

  if (typeof definition.handler !== 'function') {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      'Hook handler function is required',
      'hooks.handler',
    );
  }

  return definition;
}
