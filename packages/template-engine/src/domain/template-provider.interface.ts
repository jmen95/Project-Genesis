export type ManifestVersion = '1.0' | '1.1';

export const SUPPORTED_MANIFEST_VERSIONS: readonly ManifestVersion[] = ['1.0', '1.1'];

export type OverwritePolicy = 'skip' | 'prompt' | 'force';

export interface TemplateVariableSchema {
  readonly type: 'string' | 'number' | 'boolean' | 'array';
  readonly required?: boolean;
  readonly default?: string | number | boolean | readonly string[];
  readonly enum?: readonly string[];
  readonly description?: string;
}

export interface TemplateComponent {
  readonly description?: string;
  readonly files: readonly string[];
  readonly dependsOn?: readonly string[];
}

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
  readonly $manifestVersion?: ManifestVersion;
  readonly id: string;
  readonly version: string;
  readonly description?: string;
  readonly genesis?: {
    readonly minVersion?: string;
    readonly maxVersion?: string;
  };
  readonly variables?: Readonly<Record<string, TemplateVariableSchema>>;
  readonly files: readonly TemplateFileEntry[];
  readonly components?: Readonly<Record<string, TemplateComponent>>;
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
