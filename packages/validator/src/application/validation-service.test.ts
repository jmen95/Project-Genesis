import { describe, expect, it } from 'vitest';

import { GENESIS_PROJECT_CONFIG_SCHEMA_VERSION } from '@genesis/config';
import type { ValidationIssue } from '@genesis/shared';

import { ValidationService } from './validation-service.js';
import { GenesisConfigRule } from '../rules/genesis-config.rule.js';

describe('ValidationService', () => {
  it('runs registered rules without modifying the service', () => {
    const service = new ValidationService();
    service.registerRule('project-config', new GenesisConfigRule());

    const invalidConfig = { schemaVersion: 99 };
    return service
      .validate({ kind: 'project-config', config: invalidConfig })
      .then((report) => {
        expect(report.success).toBe(false);
      });
  });

  it('allows adding rules independently', () => {
    const service = new ValidationService();
    const customRule = {
      id: 'CUSTOM-001',
      validate(): ValidationIssue[] {
        return [{ ruleId: 'CUSTOM-001', severity: 'warning', message: 'custom' }];
      },
    };
    service.registerRule('project-config', customRule);

    return service
      .validate({
        kind: 'project-config',
        config: {
          schemaVersion: GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
          project: { name: 'test-game', version: '0.1.0', type: 'game' },
          engine: { target: 'unity' },
          platforms: { targets: ['mobile'] },
          modules: { enabled: ['assets', 'scripts', 'tests'] },
          assets: { root: 'Assets' },
          scripts: { root: 'Scripts', language: 'csharp' },
          genesis: { version: '0.3.0', template: 'default', createdAt: '2026-07-26T12:00:00.000Z' },
        },
      })
      .then((report) => {
        expect(report.warningCount).toBeGreaterThanOrEqual(1);
      });
  });
});
