export interface CreateProjectRequest {
  readonly projectName: string;
  readonly templateId?: string;
  readonly outputPath: string;
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly genesisVersion: string;
  readonly author?: string;
  readonly license?: string;
}
