export interface GenerationMetadata {
  readonly genesisVersion: string;
  readonly templateId: string;
  readonly templateVersion: string;
  readonly generatedAt: string;
  readonly projectSchemaVersion: number;
  readonly filesSummary: {
    readonly created: number;
    readonly overwritten: number;
    readonly skipped: number;
  };
}

export interface GenerationReport {
  readonly metadata?: GenerationMetadata;
  readonly metadataWriteError?: string;
}
