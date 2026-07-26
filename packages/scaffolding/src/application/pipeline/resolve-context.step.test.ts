import { describe, expect, it, vi } from 'vitest';

import { ConfigurationError } from '@genesis/core';
import { ok } from '@genesis/shared';
import type { ContextAssembler, TemplateVariableResolver } from '@genesis/template-engine';

import { ResolveContextStep } from './resolve-context.step.js';

describe('ResolveContextStep', () => {
  it('merges assembler output with resolved variables without mutating inputs', async () => {
    const assembler: ContextAssembler = {
      assemble: vi.fn().mockReturnValue({
        projectName: 'my-game',
        projectNamePascal: 'MyGame',
      }),
    } as unknown as ContextAssembler;

    const resolver: TemplateVariableResolver = {
      resolve: vi.fn().mockReturnValue(ok({ projectName: 'my-game' })),
    } as unknown as TemplateVariableResolver;

    const step = new ResolveContextStep(assembler, resolver);
    const template = {
      rootPath: '/templates/default',
      manifest: {
        id: 'default',
        version: '1.0.0',
        files: [],
        variables: {
          projectName: { type: 'string', required: true },
        },
      },
    };

    const output = await step.execute({
      request: {
        projectName: 'my-game',
        templateId: 'default',
        outputPath: '/tmp/my-game',
        genesisVersion: '0.3.0',
      },
      template,
    });

    expect(resolver.resolve).toHaveBeenCalledWith(template.manifest.variables, {
      projectName: 'my-game',
      templateId: 'default',
      genesisVersion: '0.3.0',
    });
    expect(output.renderContext.projectName).toBe('my-game');
    expect(output.renderContext.genesisConfigSource).toContain('schemaVersion: 1');
    expect(output.renderContext.projectSchemaVersion).toBe(1);
  });

  it('throws when variable resolution fails', async () => {
    const assembler: ContextAssembler = {
      assemble: vi.fn().mockReturnValue({}),
    } as unknown as ContextAssembler;

    const resolver: TemplateVariableResolver = {
      resolve: vi.fn().mockReturnValue({
        ok: false,
        error: [{ ruleId: 'VAR-001', severity: 'error', message: 'missing' }],
      }),
    } as unknown as TemplateVariableResolver;

    const step = new ResolveContextStep(assembler, resolver);

    await expect(
      step.execute({
        request: {
          projectName: 'my-game',
          outputPath: '/tmp/my-game',
          genesisVersion: '0.3.0',
        },
        template: {
          rootPath: '/templates/default',
          manifest: { id: 'default', version: '1.0.0', files: [] },
        },
      }),
    ).rejects.toBeInstanceOf(ConfigurationError);
  });
});
