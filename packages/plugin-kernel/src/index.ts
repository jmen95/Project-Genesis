// Contracts
export type { PluginCapability } from './domain/plugin-capability.js';
export { PLUGIN_CAPABILITIES, isPluginCapability } from './domain/plugin-capability.js';
export type { PluginState } from './domain/plugin-state.js';
export type { PluginLoadStage, PluginLoadError } from './domain/plugin-load-error.js';
export type { PluginManifest } from './domain/plugin-manifest.js';
export { PLUGIN_API_VERSION, PLUGIN_MANIFEST_FILE } from './domain/plugin-manifest.js';
export type { RegistryEntry } from './domain/registry-entry.js';
export type { PluginRecord, PluginContributions } from './domain/plugin-record.js';
export type { HookPoint } from './domain/hooks.js';
export type {
  TemplateRegistration,
  ValidatorRegistration,
  CommandRegistration,
  HookRegistration,
  HookHandler,
  HookExecutionContext,
  ValidationTargetKind,
} from './domain/contributions.js';
export { RegistryError } from './domain/errors/registry.errors.js';
export type { RegistryErrorCode } from './domain/errors/registry.errors.js';

// Application
export type { GenesisPlugin } from './application/genesis-plugin.js';
export type { PluginContext } from './application/plugin-context.js';
export {
  PluginHost,
  createPluginHost,
  resolveDefaultPluginSearchPaths,
} from './application/plugin-host.js';
export type { PluginHostOptions } from './application/plugin-host.js';
export { HookRunner, HookExecutionError } from './application/hook-runner.js';
export { validatePluginId, PLUGIN_ID_PATTERN } from './application/manifest-validator.js';
