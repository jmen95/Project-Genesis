import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { IFilesystem } from '@genesis/core';
import type { PluginHost } from '@genesis/plugin-kernel';
import {
  CompositeTemplateProvider,
  PluginTemplateProvider,
  TemplateProviderRegistry,
} from '@genesis/template-engine';
import type { ITemplateProvider } from '@genesis/template-engine';
import type { IValidationRule } from '@genesis/validator';
import type { RegistryValidationService } from '@genesis/validator';

export interface WirePluginHostOptions {
  readonly host: PluginHost;
  readonly filesystem: IFilesystem;
  readonly genesisVersion: string;
  readonly builtInTemplateProvider: ITemplateProvider;
  readonly validationService: RegistryValidationService;
}

export interface WiredPluginServices {
  readonly templateProvider: CompositeTemplateProvider;
  readonly templateRegistry: TemplateProviderRegistry;
}

export function wirePluginHost(options: WirePluginHostOptions): WiredPluginServices {
  const templateRegistry = new TemplateProviderRegistry();

  for (const entry of options.host.getTemplateRegistrations()) {
    const contribution = entry.value;
    const pluginRecord = options.host.getPlugin(entry.pluginId);
    const templatesPath = pluginRecord?.manifest.templates ?? 'templates';

    const provider =
      contribution.provider ??
      new PluginTemplateProvider({
        filesystem: options.filesystem,
        pluginRoot: pluginRecord?.pluginRoot ?? '',
        templatesPath,
        genesisVersion: options.genesisVersion,
      });

    templateRegistry.registerPlugin({
      templateId: contribution.templateId,
      version: contribution.version,
      pluginId: entry.pluginId,
      provider: provider as ITemplateProvider,
      ...(contribution.description !== undefined ? { description: contribution.description } : {}),
      ...(contribution.priority !== undefined ? { priority: contribution.priority } : {}),
    });
  }

  for (const entry of options.host.getValidatorRegistrations()) {
    options.validationService.registerRule(
      entry.value.kind,
      entry.value.rule as IValidationRule<unknown>,
    );
  }

  const templateProvider = new CompositeTemplateProvider(
    templateRegistry,
    options.builtInTemplateProvider,
  );

  return { templateProvider, templateRegistry };
}

export function resolveProjectRoot(): string {
  if (process.env['GENESIS_PROJECT_ROOT']) {
    return process.env['GENESIS_PROJECT_ROOT'];
  }

  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  return resolve(currentDir, '..', '..', '..', '..');
}
