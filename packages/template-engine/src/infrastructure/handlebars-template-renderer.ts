import Handlebars from 'handlebars';

import { camelCase, kebabCase, pascalCase, snakeCase } from '@genesis/shared';

import type { ITemplateRenderer } from '../domain/template-engine.interface.js';
import type { RenderContext } from '../domain/template-engine.interface.js';

export class HandlebarsTemplateRenderer implements ITemplateRenderer {
  private readonly handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  render(templateContent: string, context: RenderContext): string {
    const compiled = this.handlebars.compile(templateContent, { noEscape: false });
    return compiled(context);
  }

  private registerHelpers(): void {
    this.handlebars.registerHelper('kebabCase', (value: string) => kebabCase(String(value)));
    this.handlebars.registerHelper('pascalCase', (value: string) => pascalCase(String(value)));
    this.handlebars.registerHelper('camelCase', (value: string) => camelCase(String(value)));
    this.handlebars.registerHelper('snakeCase', (value: string) => snakeCase(String(value)));
  }
}
