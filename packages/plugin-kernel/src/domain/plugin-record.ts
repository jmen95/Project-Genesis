import type {
  CommandRegistration,
  HookRegistration,
  TemplateRegistration,
  ValidatorRegistration,
} from './contributions.js';
import type { PluginLoadError } from './plugin-load-error.js';
import type { PluginManifest } from './plugin-manifest.js';
import type { PluginState } from './plugin-state.js';

export interface PluginContributions {
  readonly templates: readonly TemplateRegistration[];
  readonly validators: readonly ValidatorRegistration[];
  readonly commands: readonly CommandRegistration[];
  readonly hooks: readonly HookRegistration[];
}

export interface PluginRecord {
  readonly id: string;
  readonly manifest: PluginManifest;
  readonly pluginRoot: string;
  readonly state: PluginState;
  readonly loadOrder: number;
  readonly errors: readonly PluginLoadError[];
  readonly contributions: PluginContributions;
}
