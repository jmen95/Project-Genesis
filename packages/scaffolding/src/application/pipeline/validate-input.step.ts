import type {
  IGenerationPipelineStep,
  PipelineInput,
  ValidatedInput,
} from '../../domain/pipeline-types.js';

export class ValidateInputStep implements IGenerationPipelineStep<PipelineInput, ValidatedInput> {
  readonly name = 'validate-input';

  async execute(input: PipelineInput): Promise<ValidatedInput> {
    return { request: input.request };
  }
}
