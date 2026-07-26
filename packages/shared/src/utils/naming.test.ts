import { describe, expect, it } from 'vitest';
import { camelCase, kebabCase, pascalCase } from './naming.js';

describe('naming utilities', () => {
  it('converts strings to kebab-case', () => {
    expect(kebabCase('HelloWorld')).toBe('hello-world');
    expect(kebabCase('my_project name')).toBe('my-project-name');
  });

  it('converts strings to pascal-case', () => {
    expect(pascalCase('hello-world')).toBe('HelloWorld');
    expect(pascalCase('my_project')).toBe('MyProject');
  });

  it('converts strings to camel-case', () => {
    expect(camelCase('hello-world')).toBe('helloWorld');
  });
});
