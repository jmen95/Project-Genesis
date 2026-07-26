import type { ValidationReport } from '@genesis/shared';

export function formatValidationReport(report: ValidationReport, projectPath?: string): string {
  const lines: string[] = [];
  const label = projectPath ?? '.';

  lines.push(`Validation Report — ${label}`);
  lines.push('');

  if (report.issues.length === 0) {
    lines.push('All checks passed.');
  } else {
    for (const issue of report.issues) {
      const pathSuffix = issue.path ? ` (${issue.path})` : '';
      lines.push(`  [${issue.severity}] ${issue.ruleId}: ${issue.message}${pathSuffix}`);
    }
  }

  lines.push('');
  lines.push(
    `Summary: ${report.errorCount} error(s), ${report.warningCount} warning(s) — ${report.success ? 'PASSED' : 'FAILED'}`,
  );
  lines.push('');

  return lines.join('\n');
}
