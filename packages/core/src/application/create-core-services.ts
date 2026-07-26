import { DefaultConfigLoader } from '../infrastructure/config/default-config-loader.js';
import { NodeFilesystem } from '../infrastructure/filesystem/node-filesystem.js';
import { ConsoleLogger } from '../infrastructure/logging/console-logger.js';
import type {
  CoreServices,
  CreateCoreServicesOptions,
  ICoreServicesFactory,
} from './ports/core-services.port.js';

export class CoreServicesFactory implements ICoreServicesFactory {
  async create(options?: CreateCoreServicesOptions): Promise<CoreServices> {
    const env = options?.env ?? process.env;
    const configLoader = new DefaultConfigLoader();
    const config = await configLoader.load({ env });
    const logger = new ConsoleLogger({ component: 'genesis' }, config.logLevel);
    const filesystem = new NodeFilesystem();

    return {
      logger,
      filesystem,
      configLoader,
      config,
    };
  }
}

export async function createCoreServices(
  options?: CreateCoreServicesOptions,
): Promise<CoreServices> {
  const factory = new CoreServicesFactory();
  return factory.create(options);
}
