import { describe, expect, it, vi } from 'vitest';

import type { IFilesystem } from '@genesis/core';
import type { ITemplateRenderer } from '@genesis/template-engine';

import { RenderStep } from './render.step.js';

describe('RenderStep', () => {
  it('renders renderable files and passes through static files', async () => {
    const filesystem: IFilesystem = {
      read: vi.fn().mockResolvedValue('Hello {{projectName}}'),
    } as unknown as IFilesystem;

    const renderer: ITemplateRenderer = {
      render: vi.fn().mockReturnValue('Hello my-game'),
    } as unknown as ITemplateRenderer;

    const step = new RenderStep(filesystem, renderer);
    const output = await step.execute({
      request: {
        projectName: 'my-game',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
      },
      template: {
        rootPath: '/templates/default',
        manifest: { id: 'default', version: '1.0.0', files: [] },
      },
      renderContext: { projectName: 'my-game' },
      plan: {
        projectName: 'my-game',
        templateId: 'default',
        outputRoot: '/tmp/my-game',
        dryRun: false,
        items: [
          {
            templatePath: '/templates/default/README.md.hbs',
            outputPath: '/tmp/my-game/README.md',
            relativePath: 'README.md',
            renderable: true,
          },
          {
            templatePath: '/templates/default/Assets/.gitkeep',
            outputPath: '/tmp/my-game/Assets/.gitkeep',
            relativePath: 'Assets/.gitkeep',
            renderable: false,
          },
        ],
      },
    });

    expect(renderer.render).toHaveBeenCalledOnce();
    expect(output.renderedItems).toHaveLength(2);
    expect(output.renderedItems[0]?.content).toBe('Hello my-game');
    expect(output.renderedItems[1]?.content).toBe('Hello {{projectName}}');
  });
});
