import { GENESIS_PROJECT_CONFIG_SCHEMA_VERSION } from '@genesis/config';

import type { GenerationMetadata, GenerationReport } from '../../domain/generation-metadata.js';
import type { IMetadataWriter } from '../../domain/metadata-writer.interface.js';
import type {
  IGenerationPipelineStep,
  MetadataPersisted,
  ValidatedOutput,
} from '../../domain/pipeline-types.js';

export class PersistMetadataStep
  implements IGenerationPipelineStep<ValidatedOutput, MetadataPersisted>
{
  readonly name = 'persist-metadata';

  private readonly metadataWriter: IMetadataWriter;

  constructor(metadataWriter: IMetadataWriter) {
    this.metadataWriter = metadataWriter;
  }

  async execute(input: ValidatedOutput): Promise<MetadataPersisted> {
    if (input.plan.dryRun) {
      return {
        request: input.request,
        template: input.template,
        renderContext: input.renderContext,
        plan: input.plan,
        results: input.results,
        ...(input.validation !== undefined ? { validation: input.validation } : {}),
        report: {},
      };
    }

    let created = 0;
    let overwritten = 0;
    let skipped = 0;

    for (const result of input.results) {
      switch (result.action) {
        case 'created':
          created += 1;
          break;
        case 'overwritten':
          overwritten += 1;
          break;
        case 'skipped':
          skipped += 1;
          break;
        default:
          break;
      }
    }

    const metadata: GenerationMetadata = {
      genesisVersion: input.request.genesisVersion,
      templateId: input.template.manifest.id,
      templateVersion: input.template.manifest.version,
      generatedAt: new Date().toISOString(),
      projectSchemaVersion: GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
      filesSummary: { created, overwritten, skipped },
    };

    let report: GenerationReport;

    try {
      await this.metadataWriter.write({
        outputRoot: input.request.outputPath,
        metadata,
      });
      report = { metadata };
    } catch (error) {
      report = {
        metadataWriteError: error instanceof Error ? error.message : 'Failed to write metadata',
      };
    }

    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
      results: input.results,
      ...(input.validation !== undefined ? { validation: input.validation } : {}),
      report,
    };
  }
}
