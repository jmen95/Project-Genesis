import type { ValidationIssue, ValidationReport } from '@genesis/shared';

export type ValidationTarget =
  | { readonly kind: 'project-config'; readonly config: unknown }
  | { readonly kind: 'template-manifest'; readonly manifest: unknown }
  | { readonly kind: 'project-output'; readonly rootPath: string };

export interface IValidationRule<T> {
  readonly id: string;
  validate(target: T): ValidationIssue[] | Promise<ValidationIssue[]>;
}

export interface IValidationService {
  validate(target: ValidationTarget): Promise<ValidationReport>;
}
