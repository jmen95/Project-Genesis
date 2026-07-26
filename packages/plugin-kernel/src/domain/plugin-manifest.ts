import type { PluginCapability } from './plugin-capability.js';

export const PLUGIN_API_VERSION = '1.0.0';

export const PLUGIN_MANIFEST_FILE = 'genesis.plugin.json';

export interface PluginManifest {
  readonly name: string;
  readonly version: string;
  readonly apiVersion: string;
  readonly genesisVersion: string;
  readonly description: string;
  readonly main: string;
  readonly capabilities?: readonly PluginCapability[];
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly templates?: string;
}
