import type { ValidationReport } from '@genesis/shared';
import type { OverwritePolicy } from '@genesis/template-engine';
import type { RenderResult } from '@genesis/template-engine';

import type { GenerationReport } from './generation-metadata.js';

export interface GenerationPlanItem {
  readonly templatePath: string;
  readonly outputPath: string;
  readonly relativePath: string;
  readonly renderable: boolean;
  readonly checksum?: string;
  readonly encoding?: string;
  readonly overwritePolicy?: OverwritePolicy;
  readonly permissions?: number;
}

export interface GenerationPlan {
  readonly projectName: string;
  readonly templateId: string;
  readonly outputRoot: string;
  readonly dryRun: boolean;
  readonly items: readonly GenerationPlanItem[];
}

export interface GenerationResult {
  readonly plan: GenerationPlan;
  readonly results: readonly RenderResult[];
  readonly created: number;
  readonly skipped: number;
  readonly overwritten: number;
  readonly dryRun: boolean;
  readonly report?: GenerationReport;
  readonly validation?: ValidationReport;
}
