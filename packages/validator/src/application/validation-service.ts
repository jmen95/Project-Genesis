import { createValidationReport, type ValidationIssue, type ValidationReport } from '@genesis/shared';
import type { IFilesystem } from '@genesis/core';

import type {
  IValidationRegistry,
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

export class RegistryValidationService implements IValidationService, IValidationRegistry {
  private readonly rules: RuleEntry[] = [];

  registerRule<T>(kind: ValidationTarget['kind'], rule: IValidationRule<T>): void {
    if (this.rules.some((entry) => entry.rule.id === rule.id)) {
      throw new Error(`Duplicate validation rule id: ${rule.id}`);
    }
    this.rules.push({
      kind,
      rule: rule as IValidationRule<unknown>,
    });
  }

  unregisterRule(ruleId: string): void {
    const index = this.rules.findIndex((entry) => entry.rule.id === ruleId);
    if (index >= 0) {
      this.rules.splice(index, 1);
    }
  }

  listRules(kind?: ValidationTarget['kind']): readonly IValidationRule<unknown>[] {
    return this.rules
      .filter((entry) => kind === undefined || entry.kind === kind)
      .map((entry) => entry.rule);
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

/** @deprecated Use RegistryValidationService */
export class ValidationService extends RegistryValidationService {}

export function createRegistryValidationService(
  filesystem: IFilesystem,
): RegistryValidationService {
  const service = new RegistryValidationService();
  service.registerRule('project-config', new GenesisConfigRule());
  service.registerRule('project-output', new ProjectStructureRule(filesystem));
  service.registerRule('project-output', new ProjectConfigFileRule(filesystem));
  return service;
}

export function createDefaultValidationService(
  filesystem: IFilesystem,
): RegistryValidationService {
  return createRegistryValidationService(filesystem);
}
