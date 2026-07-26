/** Current Genesis project config schema version. */
export const GENESIS_PROJECT_CONFIG_SCHEMA_VERSION = 1 as const;

export type GenesisProjectConfigSchemaVersion = typeof GENESIS_PROJECT_CONFIG_SCHEMA_VERSION;

export type ProjectType = 'game';
export type EngineTarget = 'unity' | 'generic';
export type PlatformTarget = 'mobile' | 'desktop' | 'web' | 'console';
export type ScriptLanguage = 'csharp' | 'typescript';

export interface GenesisProjectConfig {
  readonly schemaVersion: GenesisProjectConfigSchemaVersion;
  readonly project: ProjectMetadata;
  readonly engine: EngineConfig;
  readonly platforms: PlatformsConfig;
  readonly modules: ModulesConfig;
  readonly assets: AssetsConfig;
  readonly scripts: ScriptsConfig;
  readonly genesis: GenesisRuntimeMetadata;
}

export interface ProjectMetadata {
  readonly name: string;
  readonly version: string;
  readonly type: ProjectType;
  readonly description?: string;
  readonly author?: string;
  readonly license?: string;
}

export interface EngineConfig {
  readonly target: EngineTarget;
  readonly version?: string;
}

export interface PlatformsConfig {
  readonly targets: readonly PlatformTarget[];
  readonly primary?: PlatformTarget;
}

export interface ModulesConfig {
  readonly enabled: readonly string[];
}

export interface AssetsConfig {
  readonly root: string;
}

export interface ScriptsConfig {
  readonly root: string;
  readonly language: ScriptLanguage;
}

export interface GenesisRuntimeMetadata {
  readonly version: string;
  readonly template: string;
  readonly createdAt: string;
}

/** Supported schema versions for compatibility checks. */
export const SUPPORTED_CONFIG_SCHEMA_VERSIONS: readonly GenesisProjectConfigSchemaVersion[] = [1];
