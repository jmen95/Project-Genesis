import type {
  ConfigLoadOptions,
  GenesisRuntimeConfig,
  IConfigLoader,
} from '../../domain/config/config.interface.js';

const VALID_LOG_LEVELS = new Set<GenesisRuntimeConfig['logLevel']>([
  'debug',
  'info',
  'warn',
  'error',
]);

function resolveLogLevel(env: Readonly<NodeJS.ProcessEnv>): GenesisRuntimeConfig['logLevel'] {
  const value = env['GENESIS_LOG_LEVEL'];
  if (value && VALID_LOG_LEVELS.has(value as GenesisRuntimeConfig['logLevel'])) {
    return value as GenesisRuntimeConfig['logLevel'];
  }
  return 'info';
}

export class DefaultConfigLoader implements IConfigLoader {
  async load(options?: ConfigLoadOptions): Promise<GenesisRuntimeConfig> {
    const env = options?.env ?? process.env;
    return {
      logLevel: resolveLogLevel(env),
    };
  }
}
