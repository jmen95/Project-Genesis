import { validateGenesisConfig } from '@genesis/config';
import type { ValidationIssue } from '@genesis/shared';

import type { IValidationRule } from '../domain/validation.interface.js';

export class GenesisConfigRule implements IValidationRule<unknown> {
  readonly id = 'CFG-VALIDATE';

  validate(config: unknown): ValidationIssue[] {
    const result = validateGenesisConfig(config);
    if (result.ok) {
      return [];
    }
    return result.error;
  }
}
