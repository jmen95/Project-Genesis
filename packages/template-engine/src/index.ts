import type { IFilesystem } from '@genesis/core';

import { ContextAssembler } from './application/context-assembler.js';
import { TemplateService } from './application/template-service.js';
import type { ITemplateEngine, ITemplateRenderer } from './domain/template-engine.interface.js';
import type { ITemplateProvider } from './domain/template-provider.interface.js';
import { FilesystemTemplateProvider } from './infrastructure/filesystem-template-provider.js';
import { HandlebarsTemplateRenderer } from './infrastructure/handlebars-template-renderer.js';

export interface TemplateEngineFactoryOptions {
  readonly filesystem: IFilesystem;
  readonly templatesRoot: string;
  readonly renderer?: ITemplateRenderer;
}

export interface TemplateEngineBundle {
  readonly engine: ITemplateEngine;
  readonly provider: ITemplateProvider;
  readonly contextAssembler: ContextAssembler;
  readonly renderer: ITemplateRenderer;
}

export function createTemplateEngineBundle(
  options: TemplateEngineFactoryOptions,
): TemplateEngineBundle {
  const renderer = options.renderer ?? new HandlebarsTemplateRenderer();
  const engine = new TemplateService({ filesystem: options.filesystem, renderer });
  const provider = new FilesystemTemplateProvider({
    filesystem: options.filesystem,
    templatesRoot: options.templatesRoot,
  });
  const contextAssembler = new ContextAssembler();

  return {
    engine,
    provider,
    contextAssembler,
    renderer,
  };
}

export type {
  RenderContext,
  RenderRequest,
  RenderResult,
  RenderAction,
  ITemplateEngine,
  ITemplateRenderer,
} from './domain/template-engine.interface.js';
export type {
  ITemplateProvider,
  ProjectTemplateDescriptor,
  ProjectTemplateManifest,
  TemplateFileEntry,
  TemplateSummary,
  OverwritePolicy,
} from './domain/template-provider.interface.js';
export { ContextAssembler } from './application/context-assembler.js';
export type { ProjectContextInput } from './application/context-assembler.js';
export { TemplateService } from './application/template-service.js';
export { HandlebarsTemplateRenderer } from './infrastructure/handlebars-template-renderer.js';
export {
  FilesystemTemplateProvider,
  resolveTemplateFilePath,
} from './infrastructure/filesystem-template-provider.js';
