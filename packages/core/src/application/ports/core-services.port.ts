import type { GenesisRuntimeConfig, IConfigLoader } from '../../domain/config/config.interface.js';
import type { IFilesystem } from '../../domain/filesystem/filesystem.interface.js';
import type { ILogger } from '../../domain/logging/logger.interface.js';

export interface CoreServices {
  readonly logger: ILogger;
  readonly filesystem: IFilesystem;
  readonly configLoader: IConfigLoader;
  readonly config: GenesisRuntimeConfig;
}

export interface CreateCoreServicesOptions {
  readonly env?: Readonly<NodeJS.ProcessEnv>;
}

export interface ICoreServicesFactory {
  create(options?: CreateCoreServicesOptions): Promise<CoreServices>;
}
