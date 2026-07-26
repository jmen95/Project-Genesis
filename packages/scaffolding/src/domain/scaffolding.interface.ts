import type { CreateProjectRequest } from './create-project-request.js';
import type { GenerationResult } from './generation-plan.js';

export interface IScaffoldingService {
  createProject(request: CreateProjectRequest): Promise<GenerationResult>;
}
