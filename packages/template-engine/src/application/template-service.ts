import type { IFilesystem } from '@genesis/core';

import type {
  ITemplateEngine,
  ITemplateRenderer,
  RenderRequest,
  RenderResult,
} from '../domain/template-engine.interface.js';

export interface TemplateServiceOptions {
  readonly filesystem: IFilesystem;
  readonly renderer: ITemplateRenderer;
}

export class TemplateService implements ITemplateEngine {
  private readonly filesystem: IFilesystem;
  private readonly renderer: ITemplateRenderer;

  constructor(options: TemplateServiceOptions) {
    this.filesystem = options.filesystem;
    this.renderer = options.renderer;
  }

  async render(request: RenderRequest): Promise<RenderResult> {
    const content = request.renderable
      ? this.renderer.render(request.templateContent, request.context)
      : request.templateContent;

    if (request.dryRun) {
      return {
        outputPath: request.outputPath,
        action: 'dry-run',
        size: Buffer.byteLength(content, 'utf8'),
      };
    }

    const exists = await this.filesystem.exists(request.outputPath);
    await this.filesystem.mkdir(this.getParentDirectory(request.outputPath));
    await this.filesystem.write(request.outputPath, content);

    return {
      outputPath: request.outputPath,
      action: exists ? 'overwritten' : 'created',
      size: Buffer.byteLength(content, 'utf8'),
    };
  }

  async renderBatch(requests: readonly RenderRequest[]): Promise<RenderResult[]> {
    const results: RenderResult[] = [];
    for (const request of requests) {
      results.push(await this.render(request));
    }
    return results;
  }

  private getParentDirectory(filePath: string): string {
    const index = filePath.lastIndexOf('/');
    if (index <= 0) {
      return '.';
    }
    return filePath.slice(0, index);
  }
}
