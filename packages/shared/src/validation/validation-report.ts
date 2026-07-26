export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  readonly ruleId: string;
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly path?: string;
}

export interface ValidationReport {
  readonly success: boolean;
  readonly issues: readonly ValidationIssue[];
  readonly errorCount: number;
  readonly warningCount: number;
}

export function createValidationReport(issues: readonly ValidationIssue[]): ValidationReport {
  let errorCount = 0;
  let warningCount = 0;

  for (const issue of issues) {
    if (issue.severity === 'error') {
      errorCount += 1;
    } else if (issue.severity === 'warning') {
      warningCount += 1;
    }
  }

  return {
    success: errorCount === 0,
    issues,
    errorCount,
    warningCount,
  };
}
