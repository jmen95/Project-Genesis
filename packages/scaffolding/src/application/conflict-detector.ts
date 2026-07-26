import type { IFilesystem } from '@genesis/core';

import { OutputConflictError } from '../domain/scaffolding.errors.js';

export class ConflictDetector {
  private readonly filesystem: IFilesystem;

  constructor(filesystem: IFilesystem) {
    this.filesystem = filesystem;
  }

  async assertWritableOutput(outputPath: string, force: boolean): Promise<void> {
    if (force) {
      return;
    }

    if (!(await this.filesystem.exists(outputPath))) {
      return;
    }

    const entries = await this.filesystem.readDir(outputPath);
    if (entries.length > 0) {
      throw new OutputConflictError(outputPath);
    }
  }
}
