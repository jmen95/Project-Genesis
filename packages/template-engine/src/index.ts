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
  readonly genesisVersion?: string;
  readonly renderer?: ITemplateRenderer;
}

/**
 * @deprecated Use ITemplateRenderer with CompositeTemplateProvider. Removed in Sprint 5.
 */
export interface TemplateEngineBundle {
  readonly provider: ITemplateProvider;
  readonly contextAssembler: ContextAssembler;
  readonly renderer: ITemplateRenderer;
}

export function createTemplateEngineBundle(
  options: TemplateEngineFactoryOptions,
): TemplateEngineBundle {
  const renderer = options.renderer ?? new HandlebarsTemplateRenderer();
  const provider = new FilesystemTemplateProvider({
    filesystem: options.filesystem,
    templatesRoot: options.templatesRoot,
    ...(options.genesisVersion !== undefined ? { genesisVersion: options.genesisVersion } : {}),
  });
  const contextAssembler = new ContextAssembler();

  return {
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
  TemplateVariableSchema,
  TemplateComponent,
  ManifestVersion,
  OverwritePolicy,
} from './domain/template-provider.interface.js';
export { SUPPORTED_MANIFEST_VERSIONS } from './domain/template-provider.interface.js';
export { TemplateManifestValidator } from './application/template-manifest-validator.js';
export { ComponentOrdering } from './application/component-ordering.js';
export { ComponentOrderingError } from './domain/component-ordering.errors.js';
export type { ComponentOrderingErrorCode } from './domain/component-ordering.errors.js';
export { TemplateVariableResolver } from './application/template-variable-resolver.js';
export type {
  ResolvedTemplateVariables,
  TemplateVariableResolutionInput,
} from './application/template-variable-resolver.js';
export { CompositeTemplateProvider } from './application/composite-template-provider.js';
export {
  TemplateProviderRegistry,
  type ITemplateProviderRegistry,
  type TemplateProviderRegistration,
} from './application/template-provider-registry.js';
export { PluginTemplateProvider } from './infrastructure/plugin-template-provider.js';
export { ContextAssembler } from './application/context-assembler.js';
export type { ProjectContextInput } from './application/context-assembler.js';
export { TemplateService } from './application/template-service.js';
export { HandlebarsTemplateRenderer } from './infrastructure/handlebars-template-renderer.js';
export {
  FilesystemTemplateProvider,
  resolveTemplateFilePath,
} from './infrastructure/filesystem-template-provider.js';
