import type { IFilesystem } from '@genesis/core';
import type { ITemplateEngine, RenderRequest, RenderResult } from '@genesis/template-engine';

import type {
  ConflictsChecked,
  IGenerationPipelineStep,
  Rendered,
} from '../../domain/pipeline-types.js';

export class RenderAndWriteStep implements IGenerationPipelineStep<ConflictsChecked, Rendered> {
  readonly name = 'render-and-write';

  private readonly filesystem: IFilesystem;
  private readonly templateEngine: ITemplateEngine;

  constructor(filesystem: IFilesystem, templateEngine: ITemplateEngine) {
    this.filesystem = filesystem;
    this.templateEngine = templateEngine;
  }

  async execute(input: ConflictsChecked): Promise<Rendered> {
    const renderRequests: RenderRequest[] = [];

    for (const item of input.plan.items) {
      const templateContent = await this.filesystem.read(item.templatePath);
      renderRequests.push({
        templateContent,
        outputPath: item.outputPath,
        context: input.renderContext,
        renderable: item.renderable,
        dryRun: input.plan.dryRun,
        ...(item.encoding !== undefined ? { encoding: item.encoding } : {}),
      });
    }

    const results: RenderResult[] = await this.templateEngine.renderBatch(renderRequests);

    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
      results,
    };
  }
}
