import type { IFilesystem } from '@genesis/core';
import type { RenderResult } from '@genesis/template-engine';

import type {
  ContentRendered,
  FilesWritten,
  IGenerationPipelineStep,
} from '../../domain/pipeline-types.js';

export class WriteFilesStep implements IGenerationPipelineStep<ContentRendered, FilesWritten> {
  readonly name = 'write-files';

  private readonly filesystem: IFilesystem;

  constructor(filesystem: IFilesystem) {
    this.filesystem = filesystem;
  }

  async execute(input: ContentRendered): Promise<FilesWritten> {
    const results: RenderResult[] = [];

    for (const item of input.renderedItems) {
      if (input.plan.dryRun) {
        results.push({
          outputPath: item.outputPath,
          action: 'dry-run',
          size: Buffer.byteLength(item.content, 'utf8'),
        });
        continue;
      }

      const exists = await this.filesystem.exists(item.outputPath);
      await this.filesystem.mkdir(this.getParentDirectory(item.outputPath));
      await this.filesystem.write(item.outputPath, item.content);

      results.push({
        outputPath: item.outputPath,
        action: exists ? 'overwritten' : 'created',
        size: Buffer.byteLength(item.content, 'utf8'),
      });
    }

    return {
      request: input.request,
      template: input.template,
      renderContext: input.renderContext,
      plan: input.plan,
      results,
    };
  }

  private getParentDirectory(filePath: string): string {
    const index = filePath.lastIndexOf('/');
    if (index <= 0) {
      return '.';
    }
    return filePath.slice(0, index);
  }
}
