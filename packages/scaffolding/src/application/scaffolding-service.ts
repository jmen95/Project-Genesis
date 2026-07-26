import type { IFilesystem } from '@genesis/core';
import type {
  ContextAssembler,
  ITemplateEngine,
  ITemplateProvider,
  RenderRequest,
} from '@genesis/template-engine';

import type { CreateProjectRequest } from '../domain/create-project-request.js';
import type { GenerationPlan, GenerationResult } from '../domain/generation-plan.js';
import type { IScaffoldingService } from '../domain/scaffolding.interface.js';
import { ConflictDetector } from './conflict-detector.js';
import { GenerationPlanBuilder } from './generation-plan-builder.js';

export interface ScaffoldingServiceOptions {
  readonly filesystem: IFilesystem;
  readonly templateProvider: ITemplateProvider;
  readonly templateEngine: ITemplateEngine;
  readonly contextAssembler: ContextAssembler;
}

export class ScaffoldingService implements IScaffoldingService {
  private readonly filesystem: IFilesystem;
  private readonly templateProvider: ITemplateProvider;
  private readonly templateEngine: ITemplateEngine;
  private readonly contextAssembler: ContextAssembler;
  private readonly planBuilder: GenerationPlanBuilder;
  private readonly conflictDetector: ConflictDetector;

  constructor(options: ScaffoldingServiceOptions) {
    this.filesystem = options.filesystem;
    this.templateProvider = options.templateProvider;
    this.templateEngine = options.templateEngine;
    this.contextAssembler = options.contextAssembler;
    this.planBuilder = new GenerationPlanBuilder();
    this.conflictDetector = new ConflictDetector(this.filesystem);
  }

  async buildProjectPlan(request: CreateProjectRequest): Promise<GenerationPlan> {
    const templateId = request.templateId ?? 'default';
    const template = await this.templateProvider.loadProjectTemplate(templateId);
    return this.planBuilder.build(request, template);
  }

  async createProject(request: CreateProjectRequest): Promise<GenerationResult> {
    await this.conflictDetector.assertWritableOutput(request.outputPath, request.force ?? false);

    const plan = await this.buildProjectPlan(request);
    const context = this.contextAssembler.assemble({
      projectName: request.projectName,
      templateName: plan.templateId,
      genesisVersion: request.genesisVersion,
      ...(request.author !== undefined ? { author: request.author } : {}),
      ...(request.license !== undefined ? { license: request.license } : {}),
    });

    const renderRequests: RenderRequest[] = [];
    for (const item of plan.items) {
      const templateContent = await this.filesystem.read(item.templatePath);
      renderRequests.push({
        templateContent,
        outputPath: item.outputPath,
        context,
        renderable: item.renderable,
        dryRun: plan.dryRun,
        ...(item.encoding !== undefined ? { encoding: item.encoding } : {}),
      });
    }

    const results = await this.templateEngine.renderBatch(renderRequests);

    let created = 0;
    let skipped = 0;
    let overwritten = 0;

    for (const result of results) {
      switch (result.action) {
        case 'created':
          created += 1;
          break;
        case 'skipped':
          skipped += 1;
          break;
        case 'overwritten':
          overwritten += 1;
          break;
        default:
          break;
      }
    }

    return {
      plan,
      results,
      created,
      skipped,
      overwritten,
      dryRun: plan.dryRun,
    };
  }
}
