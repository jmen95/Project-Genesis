import { describe, expect, it } from 'vitest';

import { ComponentOrderingError } from '../domain/component-ordering.errors.js';
import type {
  ProjectTemplateManifest,
  TemplateFileEntry,
} from '../domain/template-provider.interface.js';
import { ComponentOrdering } from './component-ordering.js';

const files: TemplateFileEntry[] = [
  { relativePath: 'README.md.hbs', outputRelativePath: 'README.md', renderable: true },
  {
    relativePath: 'genesis.config.ts.hbs',
    outputRelativePath: 'genesis.config.ts',
    renderable: true,
  },
  { relativePath: 'Assets/.gitkeep', outputRelativePath: 'Assets/.gitkeep', renderable: false },
];

describe('ComponentOrdering', () => {
  const ordering = new ComponentOrdering();

  it('returns files unchanged when no components are defined', () => {
    const manifest: ProjectTemplateManifest = {
      id: 'default',
      version: '1.0.0',
      files: [],
    };

    expect(ordering.orderFiles(manifest, files)).toEqual(files);
  });

  it('orders files by component dependencies deterministically', () => {
    const manifest: ProjectTemplateManifest = {
      id: 'default',
      version: '1.0.0',
      files: [],
      components: {
        docs: { files: ['README.md.hbs'], dependsOn: ['structure'] },
        structure: { files: ['Assets/.gitkeep'], dependsOn: [] },
        config: { files: ['genesis.config.ts.hbs'], dependsOn: ['structure'] },
      },
    };

    const first = ordering.orderFiles(manifest, files).map((file) => file.relativePath);
    const second = ordering.orderFiles(manifest, files).map((file) => file.relativePath);

    expect(first).toEqual(second);
    expect(first[0]).toBe('Assets/.gitkeep');
  });

  it('throws COMP-001 for missing dependencies', () => {
    const manifest: ProjectTemplateManifest = {
      id: 'default',
      version: '1.0.0',
      files: [],
      components: {
        docs: { files: ['README.md.hbs'], dependsOn: ['missing'] },
      },
    };

    try {
      ordering.orderFiles(manifest, files);
      expect.fail('expected ComponentOrderingError');
    } catch (error) {
      expect(error).toBeInstanceOf(ComponentOrderingError);
      expect((error as ComponentOrderingError).componentCode).toBe('COMP-001');
    }
  });

  it('throws COMP-002 for circular dependencies', () => {
    const manifest: ProjectTemplateManifest = {
      id: 'default',
      version: '1.0.0',
      files: [],
      components: {
        a: { files: ['README.md.hbs'], dependsOn: ['b'] },
        b: { files: ['genesis.config.ts.hbs'], dependsOn: ['a'] },
      },
    };

    try {
      ordering.orderFiles(manifest, files);
      expect.fail('expected ComponentOrderingError');
    } catch (error) {
      expect(error).toBeInstanceOf(ComponentOrderingError);
      expect((error as ComponentOrderingError).componentCode).toBe('COMP-002');
    }
  });
});
