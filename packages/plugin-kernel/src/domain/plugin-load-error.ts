export type PluginLoadStage =
  | 'discover'
  | 'validate-manifest'
  | 'validate-id'
  | 'validate-genesis-version'
  | 'validate-capabilities'
  | 'validate-dependencies'
  | 'validate-entry'
  | 'import'
  | 'contract-check'
  | 'validate-definition'
  | 'onLoad'
  | 'register';

export interface PluginLoadError {
  readonly pluginId: string;
  readonly stage: PluginLoadStage;
  readonly reason: string;
  readonly cause?: Error;
}
