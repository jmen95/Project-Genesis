import { join } from 'node:path';

import type { ProjectTemplateDescriptor } from '@genesis/template-engine';
import { resolveTemplateFilePath } from '@genesis/template-engine';

import type { CreateProjectRequest } from '../domain/create-project-request.js';
import type { GenerationPlan, GenerationPlanItem } from '../domain/generation-plan.js';

export class GenerationPlanBuilder {
  build(request: CreateProjectRequest, template: ProjectTemplateDescriptor): GenerationPlan {
    const templateId = request.templateId ?? 'default';
    const items: GenerationPlanItem[] = template.manifest.files.map((file) => ({
      templatePath: resolveTemplateFilePath(template.rootPath, file.relativePath),
      outputPath: join(request.outputPath, file.outputRelativePath),
      relativePath: file.outputRelativePath,
      renderable: file.renderable,
      ...(file.checksum !== undefined ? { checksum: file.checksum } : {}),
      ...(file.encoding !== undefined ? { encoding: file.encoding } : {}),
      ...(file.overwritePolicy !== undefined ? { overwritePolicy: file.overwritePolicy } : {}),
      ...(file.permissions !== undefined ? { permissions: file.permissions } : {}),
    }));

    return {
      projectName: request.projectName,
      templateId,
      outputRoot: request.outputPath,
      dryRun: request.dryRun ?? false,
      items,
    };
  }
}
