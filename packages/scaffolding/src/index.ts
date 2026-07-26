import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateEngine,
  ITemplateProvider,
} from '@genesis/template-engine';

import { ScaffoldingService } from './application/scaffolding-service.js';
import type { ScaffoldingServiceOptions } from './application/scaffolding-service.js';

export interface CreateScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateEngine: ITemplateEngine;
  readonly contextAssembler: ContextAssembler;
}

export function createScaffoldingService(
  options: CreateScaffoldingServiceOptions,
): ScaffoldingService {
  return new ScaffoldingService(options satisfies ScaffoldingServiceOptions);
}

export type { CreateProjectRequest } from './domain/create-project-request.js';
export type {
  GenerationPlan,
  GenerationPlanItem,
  GenerationResult,
} from './domain/generation-plan.js';
export type { IScaffoldingService } from './domain/scaffolding.interface.js';
export { OutputConflictError } from './domain/scaffolding.errors.js';
export { ScaffoldingService } from './application/scaffolding-service.js';
export { ConflictDetector } from './application/conflict-detector.js';
export { GenerationPlanBuilder } from './application/generation-plan-builder.js';
