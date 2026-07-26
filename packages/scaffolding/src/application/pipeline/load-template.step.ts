import type { ITemplateProvider } from '@genesis/template-engine';

import type {
  IGenerationPipelineStep,
  TemplateLoaded,
  ValidatedInput,
} from '../../domain/pipeline-types.js';

export class LoadTemplateStep implements IGenerationPipelineStep<ValidatedInput, TemplateLoaded> {
  readonly name = 'load-template';

  private readonly templateProvider: ITemplateProvider;

  constructor(templateProvider: ITemplateProvider) {
    this.templateProvider = templateProvider;
  }

  async execute(input: ValidatedInput): Promise<TemplateLoaded> {
    const templateId = input.request.templateId ?? 'default';
    const template = await this.templateProvider.loadProjectTemplate(templateId);
    return {
      request: input.request,
      template,
    };
  }
}
