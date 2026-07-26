import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EXIT_INVALID_ARGUMENT,
  EXIT_SUCCESS,
  type ExitCode,
  GenesisError,
  createCoreServices,
} from '@genesis/core';
import type { GenerationResult } from '@genesis/scaffolding';
import { createScaffoldingService } from '@genesis/scaffolding';
import { createTemplateEngineBundle } from '@genesis/template-engine';
import { createDefaultValidationService } from '@genesis/validator';

import { getCliVersion } from '../version.js';
import { CreateProjectUseCase } from './create-project.use-case.js';
import { NewProjectHandler } from './handlers/new-project.handler.js';
import { ValidateProjectHandler } from './handlers/validate-project.handler.js';
import { ValidateProjectUseCase } from './validate-project.use-case.js';

export interface CliServices {
  readonly newProjectHandler: NewProjectHandler;
  readonly validateProjectHandler: ValidateProjectHandler;
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
  const templateBundle = createTemplateEngineBundle({
    filesystem: core.filesystem,
    templatesRoot,
    genesisVersion,
  });
  const validationService = createDefaultValidationService(core.filesystem);
  const scaffolding = createScaffoldingService({
    filesystem: core.filesystem,
    templateProvider: templateBundle.provider,
    templateEngine: templateBundle.engine,
    contextAssembler: templateBundle.contextAssembler,
    validationService,
  });

  const createProjectUseCase = new CreateProjectUseCase(scaffolding);
  const validateProjectUseCase = new ValidateProjectUseCase(validationService, core.filesystem);

  return {
    newProjectHandler: new NewProjectHandler(createProjectUseCase),
    validateProjectHandler: new ValidateProjectHandler(validateProjectUseCase),
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
