/**
 * Runtime internal API — consumed by @genesis/plugin-sdk adapter only.
 *
 * Not a supported surface for plugin authors or external integrators.
 */

export type { PluginContext } from './application/plugin-context.js';
export type {
  TemplateRegistration,
  ValidatorRegistration,
  CommandRegistration,
  HookRegistration,
  HookHandler,
  HookExecutionContext,
  CommandHandlerContext,
  ValidationTargetKind,
} from './domain/contributions.js';
export type { RegistryEntry } from './domain/registry-entry.js';
