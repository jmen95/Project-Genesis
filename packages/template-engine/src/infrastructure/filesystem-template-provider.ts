import { join, relative, resolve } from 'node:path';

import type { IFilesystem } from '@genesis/core';
import { ConfigurationError } from '@genesis/core';

import type {
  ITemplateProvider,
  ProjectTemplateDescriptor,
  ProjectTemplateManifest,
  TemplateFileEntry,
  TemplateSummary,
} from '../domain/template-provider.interface.js';

const MANIFEST_FILE_NAME = 'genesis.template.json';
const TEMPLATE_SUFFIX = '.hbs';

export interface FilesystemTemplateProviderOptions {
  readonly filesystem: IFilesystem;
  readonly templatesRoot: string;
}

export class FilesystemTemplateProvider implements ITemplateProvider {
  private readonly filesystem: IFilesystem;
  private readonly templatesRoot: string;

  constructor(options: FilesystemTemplateProviderOptions) {
    this.filesystem = options.filesystem;
    this.templatesRoot = options.templatesRoot;
  }

  async listTemplates(): Promise<readonly TemplateSummary[]> {
    const projectsRoot = join(this.templatesRoot, 'projects');
    if (!(await this.filesystem.exists(projectsRoot))) {
      return [];
    }

    const entries = await this.filesystem.readDir(projectsRoot);
    const summaries: TemplateSummary[] = [];

    for (const entry of entries) {
      const templateRoot = join(projectsRoot, entry);
      const stat = await this.filesystem.stat(templateRoot);
      if (!stat.isDirectory) {
        continue;
      }

      const manifestPath = join(templateRoot, MANIFEST_FILE_NAME);
      if (!(await this.filesystem.exists(manifestPath))) {
        continue;
      }

      const manifest = await this.readManifest(manifestPath);
      summaries.push({
        id: manifest.id,
        version: manifest.version,
        ...(manifest.description !== undefined ? { description: manifest.description } : {}),
      });
    }

    return summaries;
  }

  async loadProjectTemplate(templateId: string): Promise<ProjectTemplateDescriptor> {
    const templateRoot = join(this.templatesRoot, 'projects', templateId);
    const manifestPath = join(templateRoot, MANIFEST_FILE_NAME);

    if (!(await this.filesystem.exists(templateRoot))) {
      throw new ConfigurationError(`Template "${templateId}" was not found`, { templateId });
    }

    if (!(await this.filesystem.exists(manifestPath))) {
      throw new ConfigurationError(`Template "${templateId}" is missing ${MANIFEST_FILE_NAME}`, {
        templateId,
      });
    }

    const manifest = await this.readManifest(manifestPath);
    const discoveredFiles = await this.discoverFiles(templateRoot);
    const mergedFiles = this.mergeManifestFiles(manifest.files, discoveredFiles);

    return {
      manifest: {
        ...manifest,
        files: mergedFiles,
      },
      rootPath: templateRoot,
    };
  }

  private async readManifest(manifestPath: string): Promise<ProjectTemplateManifest> {
    const raw = await this.filesystem.read(manifestPath);
    const parsed = JSON.parse(raw) as ProjectTemplateManifest;

    if (!parsed.id || !parsed.version || !Array.isArray(parsed.files)) {
      throw new ConfigurationError(`Invalid ${MANIFEST_FILE_NAME} at ${manifestPath}`);
    }

    return parsed;
  }

  private mergeManifestFiles(
    manifestFiles: readonly TemplateFileEntry[],
    discoveredFiles: readonly TemplateFileEntry[],
  ): TemplateFileEntry[] {
    const byPath = new Map<string, TemplateFileEntry>();

    for (const file of discoveredFiles) {
      byPath.set(file.relativePath, file);
    }

    for (const file of manifestFiles) {
      const existing = byPath.get(file.relativePath);
      byPath.set(file.relativePath, {
        ...existing,
        ...file,
        outputRelativePath:
          file.outputRelativePath ?? existing?.outputRelativePath ?? file.relativePath,
        renderable: file.renderable ?? existing?.renderable ?? false,
      });
    }

    return [...byPath.values()];
  }

  private async discoverFiles(templateRoot: string): Promise<TemplateFileEntry[]> {
    const files: TemplateFileEntry[] = [];
    await this.walkDirectory(templateRoot, templateRoot, files);
    return files;
  }

  private async walkDirectory(
    currentDir: string,
    templateRoot: string,
    files: TemplateFileEntry[],
  ): Promise<void> {
    const entries = await this.filesystem.readDir(currentDir);

    for (const entry of entries) {
      if (entry === MANIFEST_FILE_NAME) {
        continue;
      }

      const absolutePath = join(currentDir, entry);
      const stat = await this.filesystem.stat(absolutePath);
      const relativePath = relative(templateRoot, absolutePath);

      if (stat.isDirectory) {
        await this.walkDirectory(absolutePath, templateRoot, files);
        continue;
      }

      if (!stat.isFile) {
        continue;
      }

      const renderable = entry.endsWith(TEMPLATE_SUFFIX);
      const outputRelativePath = renderable
        ? relativePath.slice(0, -TEMPLATE_SUFFIX.length)
        : relativePath;

      files.push({
        relativePath,
        outputRelativePath,
        renderable,
        encoding: 'utf-8',
      });
    }
  }
}

export function resolveTemplateFilePath(templateRoot: string, relativePath: string): string {
  return resolve(templateRoot, relativePath);
}
