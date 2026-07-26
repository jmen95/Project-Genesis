import { describe, expect, it } from 'vitest';

import { TemplateVariableResolver } from './template-variable-resolver.js';

describe('TemplateVariableResolver', () => {
  const resolver = new TemplateVariableResolver();

  it('returns immutable resolved variables without mutating input', () => {
    const schema = {
      projectName: { type: 'string' as const, required: true },
      license: { type: 'string' as const, default: 'MIT' },
    };

    const input = {
      projectName: 'my-game',
      templateId: 'default',
      genesisVersion: '0.3.0',
    };

    const first = resolver.resolve(schema, input);
    const second = resolver.resolve(schema, input);

    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.value).toEqual({ projectName: 'my-game', license: 'MIT' });
      expect(second.ok && second.value).toEqual(first.value);
      expect(first.value).not.toBe(second.value);
    }
  });

  it('reports missing required variables', () => {
    const result = resolver.resolve(
      {
        author: { type: 'string', required: true },
      },
      {
        projectName: 'my-game',
        templateId: 'default',
        genesisVersion: '0.3.0',
      },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.ruleId).toBe('VAR-001');
    }
  });
});
