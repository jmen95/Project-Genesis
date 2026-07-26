import { join } from 'node:path';

import type { IFilesystem } from '@genesis/core';

import type { ITemplateProvider } from '../domain/template-provider.interface.js';
import { FilesystemTemplateProvider } from '../infrastructure/filesystem-template-provider.js';

export interface PluginTemplateProviderOptions {
  readonly filesystem: IFilesystem;
  readonly pluginRoot: string;
  readonly templatesPath: string;
  readonly genesisVersion: string;
}

export class PluginTemplateProvider implements ITemplateProvider {
  private readonly delegate: FilesystemTemplateProvider;

  constructor(options: PluginTemplateProviderOptions) {
    this.delegate = new FilesystemTemplateProvider({
      filesystem: options.filesystem,
      templatesRoot: join(options.pluginRoot, options.templatesPath),
      genesisVersion: options.genesisVersion,
    });
  }

  listTemplates() {
    return this.delegate.listTemplates();
  }

  loadProjectTemplate(templateId: string) {
    return this.delegate.loadProjectTemplate(templateId);
  }
}
