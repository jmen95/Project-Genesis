import type { GenerationMetadata } from './generation-metadata.js';

export interface MetadataWriteOptions {
  readonly outputRoot: string;
  readonly metadata: GenerationMetadata;
}

export interface IMetadataWriter {
  write(options: MetadataWriteOptions): Promise<void>;
}
