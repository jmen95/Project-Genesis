import type { PluginCapability } from '@genesis/plugin-kernel';

import type { PluginDefinition } from '../types.js';

export function inferCapabilities(definition: PluginDefinition): readonly PluginCapability[] {
  const capabilities = new Set<PluginCapability>();

  if (definition.templates && definition.templates.length > 0) {
    capabilities.add('template');
  }
  if (definition.validators && definition.validators.length > 0) {
    capabilities.add('validator');
  }
  if (definition.hooks && Object.keys(definition.hooks).length > 0) {
    capabilities.add('hook');
  }
  if (definition.commands && definition.commands.length > 0) {
    capabilities.add('command');
  }

  return [...capabilities].sort();
}
