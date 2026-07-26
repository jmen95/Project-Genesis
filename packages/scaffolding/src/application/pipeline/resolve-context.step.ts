import { buildGenesisProjectConfig, serializeGenesisConfig } from '@genesis/config';
import type { ContextAssembler, RenderContext } from '@genesis/template-engine';

import type {
  ContextResolved,
  IGenerationPipelineStep,
  TemplateLoaded,
} from '../../domain/pipeline-types.js';

export class ResolveContextStep
  implements IGenerationPipelineStep<TemplateLoaded, ContextResolved>
{
  readonly name = 'resolve-context';

  private readonly contextAssembler: ContextAssembler;

  constructor(contextAssembler: ContextAssembler) {
    this.contextAssembler = contextAssembler;
  }

  async execute(input: TemplateLoaded): Promise<ContextResolved> {
    const templateContext = this.contextAssembler.assemble({
      projectName: input.request.projectName,
      templateName: input.template.manifest.id,
      genesisVersion: input.request.genesisVersion,
      ...(input.request.author !== undefined ? { author: input.request.author } : {}),
      ...(input.request.license !== undefined ? { license: input.request.license } : {}),
    });

    const projectConfig = buildGenesisProjectConfig({
      projectName: input.request.projectName,
      genesisVersion: input.request.genesisVersion,
      templateName: input.template.manifest.id,
      ...(input.request.author !== undefined ? { author: input.request.author } : {}),
      ...(input.request.license !== undefined ? { license: input.request.license } : {}),
    });

    const renderContext: RenderContext = {
      ...templateContext,
      genesisConfigSource: serializeGenesisConfig(projectConfig),
    };

    return {
      request: input.request,
      template: input.template,
      renderContext,
    };
  }
}
