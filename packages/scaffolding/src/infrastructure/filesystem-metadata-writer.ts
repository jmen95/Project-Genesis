import { join } from 'node:path';

import type { IFilesystem } from '@genesis/core';

import type { IMetadataWriter, MetadataWriteOptions } from '../domain/metadata-writer.interface.js';

export class FilesystemMetadataWriter implements IMetadataWriter {
  private readonly filesystem: IFilesystem;

  constructor(filesystem: IFilesystem) {
    this.filesystem = filesystem;
  }

  async write(options: MetadataWriteOptions): Promise<void> {
    const metadataDir = join(options.outputRoot, '.genesis');
    const metadataPath = join(metadataDir, 'metadata.json');

    await this.filesystem.mkdir(metadataDir);
    await this.filesystem.write(
      metadataPath,
      `${JSON.stringify({ schemaVersion: 1, ...options.metadata }, null, 2)}\n`,
    );
  }
}
