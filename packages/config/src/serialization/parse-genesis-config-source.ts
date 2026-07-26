import type { Result } from '@genesis/shared';
import type { ValidationIssue } from '@genesis/shared';

import type { GenesisProjectConfig } from '../domain/genesis-project-config.js';
import { validateGenesisConfig } from '../validation/validate-genesis-config.js';

/**
 * Extracts the default export object from a self-contained genesis.config.ts file.
 * Supports the Sprint 3 generated format (plain object literal with single-quoted strings).
 */
export function parseGenesisConfigSource(
  source: string,
): Result<GenesisProjectConfig, ValidationIssue[]> {
  const exportIndex = source.indexOf('export default');
  if (exportIndex === -1) {
    return {
      ok: false,
      error: [
        {
          ruleId: 'CFG-001',
          severity: 'error',
          message: 'Missing export default in genesis.config.ts',
        },
      ],
    };
  }

  const braceStart = source.indexOf('{', exportIndex);
  if (braceStart === -1) {
    return {
      ok: false,
      error: [
        {
          ruleId: 'CFG-001',
          severity: 'error',
          message: 'Could not parse genesis.config.ts object literal',
        },
      ],
    };
  }

  let depth = 0;
  let braceEnd = -1;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        braceEnd = index;
        break;
      }
    }
  }

  if (braceEnd === -1) {
    return {
      ok: false,
      error: [
        {
          ruleId: 'CFG-001',
          severity: 'error',
          message: 'Unterminated object literal in genesis.config.ts',
        },
      ],
    };
  }

  const objectLiteral = source.slice(braceStart, braceEnd + 1);

  try {
    const evaluate = new Function(`return (${objectLiteral});`) as () => unknown;
    const parsed = evaluate();
    return validateGenesisConfig(parsed);
  } catch {
    return {
      ok: false,
      error: [
        {
          ruleId: 'CFG-001',
          severity: 'error',
          message: 'Failed to parse genesis.config.ts object literal',
        },
      ],
    };
  }
}
