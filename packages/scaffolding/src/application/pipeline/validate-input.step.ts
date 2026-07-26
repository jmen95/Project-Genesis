import { validateProjectName, validateTemplateId } from '@genesis/shared';

import type {
  IGenerationPipelineStep,
  PipelineInput,
  ValidatedInput,
} from '../../domain/pipeline-types.js';
import { InputValidationError } from '../../domain/scaffolding.errors.js';

export class ValidateInputStep implements IGenerationPipelineStep<PipelineInput, ValidatedInput> {
  readonly name = 'validate-input';

  async execute(input: PipelineInput): Promise<ValidatedInput> {
    const { request } = input;

    if (!request.projectName || request.projectName.trim().length === 0) {
      throw new InputValidationError('Project name is required');
    }

    const nameResult = validateProjectName(request.projectName);
    if (!nameResult.ok) {
      throw new InputValidationError(nameResult.error);
    }

    const templateId = request.templateId ?? 'default';
    const templateResult = validateTemplateId(templateId);
    if (!templateResult.ok) {
      throw new InputValidationError(templateResult.error);
    }

    if (!request.outputPath || request.outputPath.trim().length === 0) {
      throw new InputValidationError('Output path is required');
    }

    if (!request.genesisVersion || request.genesisVersion.trim().length === 0) {
      throw new InputValidationError('Genesis version is required');
    }

    return {
      request: {
        ...request,
        projectName: nameResult.value,
        templateId: templateResult.value,
      },
    };
  }
}
