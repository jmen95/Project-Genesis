import { createValidationReport, type ValidationIssue, type ValidationReport } from '@genesis/shared';
import type { IFilesystem } from '@genesis/core';

import type {
  IValidationRule,
  IValidationService,
  ValidationTarget,
} from '../domain/validation.interface.js';
import { GenesisConfigRule } from '../rules/genesis-config.rule.js';
import { ProjectConfigFileRule } from '../rules/project-config-file.rule.js';
import { ProjectStructureRule } from '../rules/project-structure.rule.js';

type RuleEntry = {
  readonly kind: ValidationTarget['kind'];
  readonly rule: IValidationRule<unknown>;
};

export class ValidationService implements IValidationService {
  private readonly rules: RuleEntry[] = [];

  registerRule<T>(kind: ValidationTarget['kind'], rule: IValidationRule<T>): void {
    this.rules.push({
      kind,
      rule: rule as IValidationRule<unknown>,
    });
  }

  async validate(target: ValidationTarget): Promise<ValidationReport> {
    const issues: ValidationIssue[] = [];

    for (const entry of this.rules) {
      if (entry.kind !== target.kind) {
        continue;
      }

      const payload = this.extractPayload(target);
      const ruleIssues = await entry.rule.validate(payload);
      issues.push(...ruleIssues);
    }

    return createValidationReport(issues);
  }

  private extractPayload(target: ValidationTarget): unknown {
    switch (target.kind) {
      case 'project-config':
        return target.config;
      case 'template-manifest':
        return target.manifest;
      case 'project-output':
        return target.rootPath;
      default:
        return undefined;
    }
  }
}

export function createDefaultValidationService(filesystem: IFilesystem): ValidationService {
  const service = new ValidationService();
  service.registerRule('project-config', new GenesisConfigRule());
  service.registerRule('project-output', new ProjectStructureRule(filesystem));
  service.registerRule('project-output', new ProjectConfigFileRule(filesystem));
  return service;
}
