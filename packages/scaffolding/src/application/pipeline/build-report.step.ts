import type { GenerationResult } from '../../domain/generation-plan.js';
import type { IGenerationPipelineStep, MetadataPersisted } from '../../domain/pipeline-types.js';

export class BuildReportStep
  implements IGenerationPipelineStep<MetadataPersisted, GenerationResult>
{
  readonly name = 'build-report';

  async execute(input: MetadataPersisted): Promise<GenerationResult> {
    let created = 0;
    let skipped = 0;
    let overwritten = 0;

    for (const result of input.results) {
      switch (result.action) {
        case 'created':
          created += 1;
          break;
        case 'skipped':
          skipped += 1;
          break;
        case 'overwritten':
          overwritten += 1;
          break;
        default:
          break;
      }
    }

    return {
      plan: input.plan,
      results: input.results,
      created,
      skipped,
      overwritten,
      dryRun: input.plan.dryRun,
      report: input.report,
      ...(input.validation !== undefined ? { validation: input.validation } : {}),
    };
  }
}
