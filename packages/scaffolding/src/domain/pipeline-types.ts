import type { CreateProjectRequest } from '../domain/create-project-request.js';

export interface IGenerationPipelineStep<TInput, TOutput> {
  readonly name: string;
  execute(input: TInput): Promise<TOutput>;
}

export interface PipelineInput {
  readonly request: CreateProjectRequest;
}

export interface ValidatedInput {
  readonly request: CreateProjectRequest;
}

export interface TemplateLoaded {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
}

export interface ContextResolved {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
  readonly renderContext: import('@genesis/template-engine').RenderContext;
}

export interface PlanBuilt {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
  readonly renderContext: import('@genesis/template-engine').RenderContext;
  readonly plan: import('../domain/generation-plan.js').GenerationPlan;
}

export interface ConflictsChecked {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
  readonly renderContext: import('@genesis/template-engine').RenderContext;
  readonly plan: import('../domain/generation-plan.js').GenerationPlan;
}

export interface Rendered {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
  readonly renderContext: import('@genesis/template-engine').RenderContext;
  readonly plan: import('../domain/generation-plan.js').GenerationPlan;
  readonly results: readonly import('@genesis/template-engine').RenderResult[];
}

export interface ValidatedOutput {
  readonly request: CreateProjectRequest;
  readonly template: import('@genesis/template-engine').ProjectTemplateDescriptor;
  readonly renderContext: import('@genesis/template-engine').RenderContext;
  readonly plan: import('../domain/generation-plan.js').GenerationPlan;
  readonly results: readonly import('@genesis/template-engine').RenderResult[];
  readonly validation?: import('@genesis/shared').ValidationReport;
}
