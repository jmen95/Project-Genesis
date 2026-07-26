import { describe, expect, it, vi } from 'vitest';

import type { ITemplateProvider, ProjectTemplateDescriptor } from '@genesis/template-engine';

import { LoadTemplateStep } from './load-template.step.js';

describe('LoadTemplateStep', () => {
  it('loads the requested template', async () => {
    const template: ProjectTemplateDescriptor = {
      rootPath: '/templates/default',
      manifest: {
        id: 'default',
        version: '1.0.0',
        files: [],
      },
    };

    const provider: ITemplateProvider = {
      listTemplates: vi.fn(),
      loadProjectTemplate: vi.fn().mockResolvedValue(template),
    };

    const step = new LoadTemplateStep(provider);
    const output = await step.execute({
      request: {
        projectName: 'my-game',
        templateId: 'default',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
      },
    });

    expect(provider.loadProjectTemplate).toHaveBeenCalledWith('default');
    expect(output.template).toBe(template);
  });
});
