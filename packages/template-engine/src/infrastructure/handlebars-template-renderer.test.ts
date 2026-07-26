import { describe, expect, it } from 'vitest';
import { HandlebarsTemplateRenderer } from '../infrastructure/handlebars-template-renderer.js';

describe('HandlebarsTemplateRenderer', () => {
  it('replaces variables in template content', () => {
    const renderer = new HandlebarsTemplateRenderer();
    const output = renderer.render('Hello {{projectNamePascal}}', {
      projectNamePascal: 'MyGame',
    });

    expect(output).toBe('Hello MyGame');
  });
});
