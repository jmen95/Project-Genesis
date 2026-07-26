export type RenderContextValue = string | number | boolean;

export type RenderContext = Readonly<Record<string, RenderContextValue>>;

export interface RenderRequest {
  readonly templateContent: string;
  readonly outputPath: string;
  readonly context: RenderContext;
  readonly renderable: boolean;
  readonly dryRun?: boolean;
  readonly encoding?: string;
}

export type RenderAction = 'created' | 'skipped' | 'overwritten' | 'dry-run';

export interface RenderResult {
  readonly outputPath: string;
  readonly action: RenderAction;
  readonly size: number;
}

export interface ITemplateRenderer {
  render(templateContent: string, context: RenderContext): string;
}

export interface ITemplateEngine {
  render(request: RenderRequest): Promise<RenderResult>;
  renderBatch(requests: readonly RenderRequest[]): Promise<RenderResult[]>;
}
