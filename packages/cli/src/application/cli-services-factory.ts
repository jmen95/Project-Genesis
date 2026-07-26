import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EXIT_INVALID_ARGUMENT,
  EXIT_SUCCESS,
  type ExitCode,
  GenesisError,
  createCoreServices,
} from '@genesis/core';
import {
  type PluginHost,
  createPluginHost,
  resolveDefaultPluginSearchPaths,
} from '@genesis/plugin-kernel';
import type { GenerationResult } from '@genesis/scaffolding';
import { createScaffoldingService } from '@genesis/scaffolding';
import { createTemplateEngineBundle } from '@genesis/template-engine';
import { createRegistryValidationService } from '@genesis/validator';

import { getCliVersion } from '../version.js';
import { CreateProjectUseCase } from './create-project.use-case.js';
import { NewProjectHandler } from './handlers/new-project.handler.js';
import { GetPluginInfoHandler, ListPluginsHandler } from './handlers/plugin.handler.js';
import { ValidateProjectHandler } from './handlers/validate-project.handler.js';
import { ValidateProjectUseCase } from './validate-project.use-case.js';
import { resolveProjectRoot, wirePluginHost } from './wire-plugin-host.js';

export interface CliServices {
  readonly newProjectHandler: NewProjectHandler;
  readonly validateProjectHandler: ValidateProjectHandler;
  readonly listPluginsHandler: ListPluginsHandler;
  readonly getPluginInfoHandler: GetPluginInfoHandler;
  readonly pluginHost: PluginHost;
}

export function resolveTemplatesRoot(): string {
  const fromEnv = process.env['GENESIS_TEMPLATES_ROOT'];
  if (fromEnv) {
    return fromEnv;
  }

  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  return resolve(currentDir, '..', '..', '..', 'templates');
}

export async function createCliServices(): Promise<CliServices> {
  const core = await createCoreServices();
  const genesisVersion = getCliVersion();
  const templatesRoot = resolveTemplatesRoot();
  const projectRoot = resolveProjectRoot();
  const templateBundle = createTemplateEngineBundle({
    filesystem: core.filesystem,
    templatesRoot,
    genesisVersion,
  });
  const validationService = createRegistryValidationService(core.filesystem);

  const pluginHost = createPluginHost({
    filesystem: core.filesystem,
    logger: core.logger,
    genesisVersion,
    searchPaths: resolveDefaultPluginSearchPaths(projectRoot),
  });
  await pluginHost.loadAll();

  const wired = wirePluginHost({
    host: pluginHost,
    filesystem: core.filesystem,
    genesisVersion,
    builtInTemplateProvider: templateBundle.provider,
    validationService,
  });

  const scaffolding = createScaffoldingService({
    filesystem: core.filesystem,
    templateProvider: wired.templateProvider,
    templateRenderer: templateBundle.renderer,
    contextAssembler: templateBundle.contextAssembler,
    validationService,
  });

  const createProjectUseCase = new CreateProjectUseCase(scaffolding, pluginHost);
  const validateProjectUseCase = new ValidateProjectUseCase(
    validationService,
    core.filesystem,
    pluginHost,
  );

  return {
    newProjectHandler: new NewProjectHandler(createProjectUseCase),
    validateProjectHandler: new ValidateProjectHandler(validateProjectUseCase),
    listPluginsHandler: new ListPluginsHandler(pluginHost),
    getPluginInfoHandler: new GetPluginInfoHandler(pluginHost),
    pluginHost,
  };
}

export function mapGenesisErrorToExitCode(error: unknown): ExitCode {
  if (error instanceof GenesisError) {
    return error.exitCode;
  }
  return EXIT_INVALID_ARGUMENT;
}

export function isSuccessExitCode(exitCode: ExitCode): boolean {
  return exitCode === EXIT_SUCCESS;
}

export type { GenerationResult };
