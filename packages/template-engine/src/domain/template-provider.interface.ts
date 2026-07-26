export type OverwritePolicy = 'skip' | 'prompt' | 'force';

export interface TemplateFileEntry {
  readonly relativePath: string;
  readonly outputRelativePath: string;
  readonly renderable: boolean;
  readonly encoding?: string;
  readonly overwritePolicy?: OverwritePolicy;
  readonly permissions?: number;
  readonly checksum?: string;
}

export interface ProjectTemplateManifest {
  readonly id: string;
  readonly version: string;
  readonly description?: string;
  readonly files: readonly TemplateFileEntry[];
}

export interface ProjectTemplateDescriptor {
  readonly manifest: ProjectTemplateManifest;
  readonly rootPath: string;
}

export interface TemplateSummary {
  readonly id: string;
  readonly version: string;
  readonly description?: string;
}

export interface ITemplateProvider {
  listTemplates(): Promise<readonly TemplateSummary[]>;
  loadProjectTemplate(templateId: string): Promise<ProjectTemplateDescriptor>;
}
