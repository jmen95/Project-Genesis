import { parseGenesisConfigSource } from '@genesis/config';
import type { IFilesystem } from '@genesis/core';
import type { ValidationIssue } from '@genesis/shared';

import type { IValidationRule } from '../domain/validation.interface.js';
import { GenesisConfigRule } from './genesis-config.rule.js';

export class ProjectConfigFileRule implements IValidationRule<string> {
  readonly id = 'CFG-FILE';

  private readonly filesystem: IFilesystem;
  private readonly configRule: GenesisConfigRule;

  constructor(filesystem: IFilesystem) {
    this.filesystem = filesystem;
    this.configRule = new GenesisConfigRule();
  }

  async validate(rootPath: string): Promise<ValidationIssue[]> {
    const configPath = `${rootPath}/genesis.config.ts`;
    if (!(await this.filesystem.exists(configPath))) {
      return [
        {
          ruleId: 'CFG-FILE',
          severity: 'error',
          message: 'Missing genesis.config.ts',
          path: 'genesis.config.ts',
        },
      ];
    }

    const source = await this.filesystem.read(configPath);
    const parsed = parseGenesisConfigSource(source);
    if (!parsed.ok) {
      return parsed.error;
    }

    return this.configRule.validate(parsed.value);
  }
}
