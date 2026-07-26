export {
  GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
  SUPPORTED_CONFIG_SCHEMA_VERSIONS,
} from './domain/genesis-project-config.js';
export type {
  AssetsConfig,
  EngineConfig,
  EngineTarget,
  GenesisProjectConfig,
  GenesisProjectConfigSchemaVersion,
  GenesisRuntimeMetadata,
  ModulesConfig,
  PlatformTarget,
  PlatformsConfig,
  ProjectMetadata,
  ProjectType,
  ScriptLanguage,
  ScriptsConfig,
} from './domain/genesis-project-config.js';
export { validateGenesisConfig } from './validation/validate-genesis-config.js';
export { buildGenesisProjectConfig } from './serialization/build-genesis-project-config.js';
export type { BuildGenesisProjectConfigInput } from './serialization/build-genesis-project-config.js';
export { serializeGenesisConfig } from './serialization/serialize-genesis-config.js';
export { parseGenesisConfigSource } from './serialization/parse-genesis-config-source.js';
