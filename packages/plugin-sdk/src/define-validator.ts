import { PluginDefinitionError } from './errors/plugin-definition.error.js';
import type { ValidatorDefinition } from './types.js';

const SHORT_ID_PATTERN = /^[A-Z0-9][A-Z0-9-]*$/;

/**
 * Declares a validator contribution.
 *
 * Validator ids are short codes scoped to the plugin (e.g. `EX-001`).
 * The SDK prefixes them as `@scope/plugin:EX-001` at registration time.
 *
 * @example
 * ```ts
 * defineValidator({
 *   id: 'EX-001',
 *   kind: 'project-output',
 *   validate: (target) => {
 *     if (target.kind !== 'project-output') return [];
 *     return target.rootPath.includes('warn')
 *       ? [{ severity: 'warning', message: 'Example warning' }]
 *       : [];
 *   },
 * })
 * ```
 */
export function defineValidator(definition: ValidatorDefinition): ValidatorDefinition {
  if (!SHORT_ID_PATTERN.test(definition.id)) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      `Invalid validator id "${definition.id}". Use uppercase codes like EX-001.`,
      'validators.id',
    );
  }

  if (typeof definition.validate !== 'function') {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      'Validator validate function is required',
      'validators.validate',
    );
  }

  return definition;
}
