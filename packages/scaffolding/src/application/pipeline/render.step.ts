import type { IFilesystem } from '@genesis/core';
import type { ITemplateRenderer } from '@genesis/template-engine';

import type {
  ConflictsChecked,
  ContentRendered,
  IGenerationPipelineStep,
  RenderedFileItem,
} from '../../domain/pipeline-types.js';

export class RenderStep implements IGenerationPipelineStep<ConflictsChecked, ContentRendered> {
  readonly name = 'render';

  private readonly filesystem: IFilesystem;
  private readonly renderer: ITemplateRenderer;

  constructor(filesystem: IFilesystem, renderer: ITemplateRenderer) {
    this.filesystem = filesystem;
    this.renderer = renderer;
  }

  async execute(input: ConflictsChecked): Promise<ContentRendered> {
    const renderedItems: RenderedFileItem[] = [];

    for (const item of input.plan.items) {
      const templateContent = await this.filesystem.read(item.templatePath);
      const content = item.renderable
        ? this.renderer.render(templateContent, input.renderContext)
        : templateContent;

      renderedItems.push({
        outputPath: item.outputPath,
        relativePath: item.relativePath,
        content,
        ...(item.encoding !== undefined ? { encoding: item.encoding } : {}),
      });
    }

    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
      renderedItems,
    };
  }
}
