export { definePlugin } from './define-plugin.js';
export { defineTemplate } from './define-template.js';
export { defineValidator } from './define-validator.js';
export { defineHook } from './define-hook.js';
export { defineCommand } from './define-command.js';
export { SDK_API_VERSION, PLUGIN_MANIFEST_FILE, PLUGIN_API_VERSION } from './version.js';
export { PluginDefinitionError } from './errors/plugin-definition.error.js';
export type { PluginDefinitionErrorCode } from './errors/plugin-definition.error.js';

export type {
  PluginDefinition,
  TemplateDefinition,
  ValidatorDefinition,
  CommandDefinition,
  HookDefinition,
  HookPoint,
  ValidationTargetKind,
  PluginSetupContext,
  PluginLogger,
  HookContext,
  CommandContext,
  ValidatorTarget,
  ValidationIssueInput,
  ValidationIssue,
  ValidationSeverity,
} from './types.js';
