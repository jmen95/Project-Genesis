import { PluginDefinitionError } from './errors/plugin-definition.error.js';
import type { CommandDefinition } from './types.js';

const COMMAND_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * Declares a runtime-agnostic CLI command contribution.
 *
 * Commands are not bound to Commander in Sprint 5 — the API is defined here
 * so plugins can declare intent. CLI binding is deferred to Sprint 5.5.
 *
 * @example
 * ```ts
 * defineCommand({
 *   id: 'hello',
 *   description: 'Print a greeting',
 *   handler: ({ logger }) => logger.info('Hello from plugin'),
 * })
 * ```
 */
export function defineCommand(definition: CommandDefinition): CommandDefinition {
  if (!COMMAND_ID_PATTERN.test(definition.id)) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      `Invalid command id "${definition.id}". Use kebab-case.`,
      'commands.id',
    );
  }

  if (!definition.description.trim()) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      'Command description is required',
      'commands.description',
    );
  }

  if (typeof definition.handler !== 'function') {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      'Command handler function is required',
      'commands.handler',
    );
  }

  return definition;
}
