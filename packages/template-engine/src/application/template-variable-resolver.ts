import { type Result, err, ok } from '@genesis/shared';
import type { ValidationIssue } from '@genesis/shared';

import type { TemplateVariableSchema } from '../domain/template-provider.interface.js';

export type ResolvedTemplateVariables = Readonly<Record<string, string | number | boolean>>;

export interface TemplateVariableResolutionInput {
  readonly projectName: string;
  readonly templateId: string;
  readonly genesisVersion: string;
  readonly author?: string;
  readonly license?: string;
}

export class TemplateVariableResolver {
  resolve(
    schema: Readonly<Record<string, TemplateVariableSchema>> | undefined,
    input: TemplateVariableResolutionInput,
  ): Result<ResolvedTemplateVariables, ValidationIssue[]> {
    if (!schema || Object.keys(schema).length === 0) {
      return ok({});
    }

    const issues: ValidationIssue[] = [];
    const resolved: Record<string, string | number | boolean> = {};

    const provided: Record<string, string | number | boolean | undefined> = {
      projectName: input.projectName,
      templateId: input.templateId,
      genesisVersion: input.genesisVersion,
      author: input.author,
      license: input.license,
    };

    for (const [name, definition] of Object.entries(schema)) {
      const rawValue = provided[name] ?? definition.default;

      if (rawValue === undefined) {
        if (definition.required) {
          issues.push({
            ruleId: 'VAR-001',
            severity: 'error',
            message: `Required template variable "${name}" is missing`,
            path: `variables.${name}`,
          });
        }
        continue;
      }

      const validated = this.validateValue(name, definition, rawValue, issues);
      if (validated !== undefined) {
        resolved[name] = validated;
      }
    }

    if (issues.some((issue) => issue.severity === 'error')) {
      return err(issues);
    }

    return ok(resolved);
  }

  private validateValue(
    name: string,
    definition: TemplateVariableSchema,
    rawValue: string | number | boolean | readonly string[],
    issues: ValidationIssue[],
  ): string | number | boolean | undefined {
    if (definition.type === 'array') {
      issues.push({
        ruleId: 'VAR-002',
        severity: 'error',
        message: `Array variable "${name}" is not supported in Sprint 3.5`,
        path: `variables.${name}`,
      });
      return undefined;
    }

    if (definition.type === 'string' && typeof rawValue !== 'string') {
      issues.push({
        ruleId: 'VAR-002',
        severity: 'error',
        message: `Variable "${name}" must be a string`,
        path: `variables.${name}`,
      });
      return undefined;
    }

    if (definition.type === 'number' && typeof rawValue !== 'number') {
      issues.push({
        ruleId: 'VAR-002',
        severity: 'error',
        message: `Variable "${name}" must be a number`,
        path: `variables.${name}`,
      });
      return undefined;
    }

    if (definition.type === 'boolean' && typeof rawValue !== 'boolean') {
      issues.push({
        ruleId: 'VAR-002',
        severity: 'error',
        message: `Variable "${name}" must be a boolean`,
        path: `variables.${name}`,
      });
      return undefined;
    }

    if (definition.enum && typeof rawValue === 'string' && !definition.enum.includes(rawValue)) {
      issues.push({
        ruleId: 'VAR-003',
        severity: 'error',
        message: `Variable "${name}" must be one of: ${definition.enum.join(', ')}`,
        path: `variables.${name}`,
      });
      return undefined;
    }

    return rawValue as string | number | boolean;
  }
}
