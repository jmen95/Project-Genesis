import { PluginDefinitionError } from './errors/plugin-definition.error.js';
import type { TemplateDefinition } from './types.js';

const TEMPLATE_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * Declares a template contribution.
 *
 * Templates are loaded from the `templates/` directory relative to the plugin root
 * (configured in `genesis.plugin.json` as `"templates": "templates"`).
 *
 * @example
 * ```ts
 * defineTemplate({
 *   id: 'my-starter',
 *   version: '1.0.0',
 *   description: 'Minimal starter template',
 * })
 * ```
 */
export function defineTemplate(definition: TemplateDefinition): TemplateDefinition {
  if (!TEMPLATE_ID_PATTERN.test(definition.id)) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      `Invalid template id "${definition.id}". Use kebab-case.`,
      'templates.id',
    );
  }

  if (!definition.version) {
    throw new PluginDefinitionError(
      'PDEF-001',
      'unknown',
      'Template version is required',
      'templates.version',
    );
  }

  return definition;
}
