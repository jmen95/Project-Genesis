import type { PluginManifest } from '../domain/plugin-manifest.js';
import type { PluginContext } from './plugin-context.js';

export interface GenesisPlugin {
  readonly manifest: PluginManifest;
  onLoad(context: PluginContext): Promise<void>;
  register(context: PluginContext): void;
  onUnload?(): Promise<void>;
}
