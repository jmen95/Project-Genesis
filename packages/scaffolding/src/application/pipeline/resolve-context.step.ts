import {
  GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
  buildGenesisProjectConfig,
  serializeGenesisConfig,
} from '@genesis/config';
import { ConfigurationError } from '@genesis/core';
import type {
  ContextAssembler,
  RenderContext,
  TemplateVariableResolver,
} from '@genesis/template-engine';

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
  private readonly variableResolver: TemplateVariableResolver;

  constructor(contextAssembler: ContextAssembler, variableResolver: TemplateVariableResolver) {
    this.contextAssembler = contextAssembler;
    this.variableResolver = variableResolver;
  }

  async execute(input: TemplateLoaded): Promise<ContextResolved> {
    const variableResult = this.variableResolver.resolve(input.template.manifest.variables, {
      projectName: input.request.projectName,
      templateId: input.template.manifest.id,
      genesisVersion: input.request.genesisVersion,
      ...(input.request.author !== undefined ? { author: input.request.author } : {}),
      ...(input.request.license !== undefined ? { license: input.request.license } : {}),
    });

    if (!variableResult.ok) {
      const message = variableResult.error.map((issue) => issue.message).join('; ');
      throw new ConfigurationError(`Template variable validation failed: ${message}`);
    }

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
      ...variableResult.value,
      genesisConfigSource: serializeGenesisConfig(projectConfig),
      projectSchemaVersion: GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
    };

    return {
      request: input.request,
      template: input.template,
      renderContext,
    };
  }
}
