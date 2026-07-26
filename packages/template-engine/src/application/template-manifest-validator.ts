import { ConfigurationError } from '@genesis/core';
import type { ValidationIssue } from '@genesis/shared';
import { createValidationReport } from '@genesis/shared';

import type { ProjectTemplateManifest } from '../domain/template-provider.interface.js';
import { SUPPORTED_MANIFEST_VERSIONS } from '../domain/template-provider.interface.js';

function compareSemver(left: string, right: string): number {
  const parse = (value: string): number[] =>
    value
      .split('.')
      .map((part) => Number.parseInt(part, 10))
      .slice(0, 3);

  const leftParts = parse(left);
  const rightParts = parse(right);

  for (let index = 0; index < 3; index += 1) {
    const diff = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

export class TemplateManifestValidator {
  validate(manifest: ProjectTemplateManifest, genesisVersion: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!manifest.id || !manifest.version || !Array.isArray(manifest.files)) {
      issues.push({
        ruleId: 'MAN-001',
        severity: 'error',
        message: 'Manifest must include id, version, and files array',
      });
      return issues;
    }

    const manifestVersion = manifest.$manifestVersion ?? '1.0';
    if (!SUPPORTED_MANIFEST_VERSIONS.includes(manifestVersion)) {
      issues.push({
        ruleId: 'MAN-001',
        severity: 'error',
        message: `Unsupported manifest version ${manifestVersion}. Supported: ${SUPPORTED_MANIFEST_VERSIONS.join(', ')}`,
        path: '$manifestVersion',
      });
      return issues;
    }

    if (manifestVersion === '1.1') {
      this.validateV11(manifest, genesisVersion, issues);
    }

    return issues;
  }

  assertValid(manifest: ProjectTemplateManifest, genesisVersion: string): void {
    const issues = this.validate(manifest, genesisVersion);
    const report = createValidationReport(issues);
    if (!report.success) {
      const message = issues.map((issue) => issue.message).join('; ');
      throw new ConfigurationError(`Invalid template manifest: ${message}`);
    }
  }

  private validateV11(
    manifest: ProjectTemplateManifest,
    genesisVersion: string,
    issues: ValidationIssue[],
  ): void {
    if (manifest.genesis?.minVersion !== undefined) {
      if (compareSemver(genesisVersion, manifest.genesis.minVersion) < 0) {
        issues.push({
          ruleId: 'MAN-002',
          severity: 'error',
          message: `Genesis ${genesisVersion} does not satisfy minVersion ${manifest.genesis.minVersion}`,
          path: 'genesis.minVersion',
        });
      }
    }

    if (manifest.variables !== undefined) {
      for (const [name, schema] of Object.entries(manifest.variables)) {
        if (!['string', 'number', 'boolean', 'array'].includes(schema.type)) {
          issues.push({
            ruleId: 'MAN-004',
            severity: 'error',
            message: `Invalid variable type for ${name}`,
            path: `variables.${name}`,
          });
        }
      }
    }

    if (manifest.components !== undefined) {
      const componentIds = new Set(Object.keys(manifest.components));
      for (const [componentId, component] of Object.entries(manifest.components)) {
        for (const dependency of component.dependsOn ?? []) {
          if (!componentIds.has(dependency)) {
            issues.push({
              ruleId: 'MAN-003',
              severity: 'error',
              message: `Component ${componentId} depends on unknown component ${dependency}`,
              path: `components.${componentId}.dependsOn`,
            });
          }
        }
      }
    }
  }
}
