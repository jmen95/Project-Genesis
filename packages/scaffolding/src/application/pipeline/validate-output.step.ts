import type { IValidationService } from '@genesis/validator';

import type {
  IGenerationPipelineStep,
  Rendered,
  ValidatedOutput,
} from '../../domain/pipeline-types.js';

export class ValidateOutputStep implements IGenerationPipelineStep<Rendered, ValidatedOutput> {
  readonly name = 'validate-output';

  private readonly validationService: IValidationService;

  constructor(validationService: IValidationService) {
    this.validationService = validationService;
  }

  async execute(input: Rendered): Promise<ValidatedOutput> {
    if (input.plan.dryRun || input.request.skipValidation) {
      return {
        request: input.request,
        template: input.template,
        renderContext: input.renderContext,
        plan: input.plan,
        results: input.results,
      };
    }

    const validation = await this.validationService.validate({
      kind: 'project-output',
      rootPath: input.request.outputPath,
    });

    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
      results: input.results,
      validation,
    };
  }
}
