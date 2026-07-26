export interface GenesisRuntimeConfig {
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface ConfigLoadOptions {
  readonly env?: Readonly<NodeJS.ProcessEnv>;
}

export interface IConfigLoader {
  load(options?: ConfigLoadOptions): Promise<GenesisRuntimeConfig>;
}
