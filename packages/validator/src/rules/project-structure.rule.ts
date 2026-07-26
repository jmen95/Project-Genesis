import type { IFilesystem } from '@genesis/core';
import type { ValidationIssue } from '@genesis/shared';

import type { IValidationRule } from '../domain/validation.interface.js';

const REQUIRED_PATHS = [
  'genesis.config.ts',
  'README.md',
  'Assets',
  'Scripts',
  'Tests',
  'docs',
] as const;

export class ProjectStructureRule implements IValidationRule<string> {
  readonly id = 'STRUCT-001';

  private readonly filesystem: IFilesystem;

  constructor(filesystem: IFilesystem) {
    this.filesystem = filesystem;
  }

  async validate(rootPath: string): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    for (const relativePath of REQUIRED_PATHS) {
      const absolutePath = `${rootPath}/${relativePath}`;
      if (!(await this.filesystem.exists(absolutePath))) {
        issues.push({
          ruleId: `STRUCT-${relativePath.replace(/[^a-zA-Z]/g, '').toUpperCase() || 'MISSING'}`,
          severity: 'error',
          message: `Missing required path: ${relativePath}`,
          path: relativePath,
        });
      }
    }

    return issues;
  }
}
