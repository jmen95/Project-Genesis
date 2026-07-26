import { describe, expect, it } from 'vitest';
import { validateTemplateId } from './template-id.js';

describe('validateTemplateId', () => {
  it('accepts valid template ids', () => {
    expect(validateTemplateId('default').ok).toBe(true);
    expect(validateTemplateId('my-template').ok).toBe(true);
  });

  it('rejects invalid template ids', () => {
    expect(validateTemplateId('Default').ok).toBe(false);
    expect(validateTemplateId('').ok).toBe(false);
  });
});
