import { camelCase, kebabCase, pascalCase, snakeCase } from '@genesis/shared';

import type { RenderContext, RenderContextValue } from '../domain/template-engine.interface.js';

export interface ProjectContextInput {
  readonly projectName: string;
  readonly templateName: string;
  readonly genesisVersion: string;
  readonly author?: string;
  readonly license?: string;
  readonly createdAt?: string;
}

export class ContextAssembler {
  assemble(input: ProjectContextInput): RenderContext {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const year = new Date(createdAt).getFullYear();

    const context: Record<string, RenderContextValue> = {
      projectName: input.projectName,
      projectNameKebab: kebabCase(input.projectName),
      projectNameCamel: camelCase(input.projectName),
      projectNamePascal: pascalCase(input.projectName),
      projectNameSnake: snakeCase(input.projectName),
      templateName: input.templateName,
      genesisVersion: input.genesisVersion,
      author: input.author ?? 'Project Genesis',
      license: input.license ?? 'MIT',
      createdAt,
      year,
    };

    return context;
  }
}
