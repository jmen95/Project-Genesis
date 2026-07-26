import type { CreateProjectRequest } from './create-project-request.js';
import type { GenerationPlan, GenerationResult } from './generation-plan.js';

export interface IScaffoldingService {
  createProject(request: CreateProjectRequest): Promise<GenerationResult>;
  buildProjectPlan(request: CreateProjectRequest): Promise<GenerationPlan>;
}
