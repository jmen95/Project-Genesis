import type { GenerationResult } from '@genesis/scaffolding';

export function formatGenerationReport(result: GenerationResult): string {
  const lines: string[] = [];
  const mode = result.dryRun ? ' (dry-run)' : '';

  lines.push(`Generation Plan — ${result.plan.projectName}${mode}`);
  lines.push(`Template: ${result.plan.templateId}`);
  lines.push(`Output: ${result.plan.outputRoot}`);
  lines.push('');

  for (const item of result.plan.items) {
    const renderResult = result.results.find((entry) => entry.outputPath === item.outputPath);
    const action = renderResult?.action ?? 'pending';
    lines.push(`  ${action.padEnd(12)} ${item.relativePath}`);
  }

  lines.push('');
  if (result.dryRun) {
    lines.push('Run without --dry-run to execute.');
  } else {
    lines.push(
      `Summary: ${result.created} created, ${result.overwritten} overwritten, ${result.skipped} skipped`,
    );
  }

  if (result.validation) {
    lines.push('');
    lines.push(
      `Validation: ${result.validation.errorCount} error(s), ${result.validation.warningCount} warning(s) — ${result.validation.success ? 'PASSED' : 'FAILED'}`,
    );
    for (const issue of result.validation.issues) {
      lines.push(`  [${issue.severity}] ${issue.ruleId}: ${issue.message}`);
    }
  }

  if (result.report?.metadataWriteError) {
    lines.push('');
    lines.push(`Metadata: write failed — ${result.report.metadataWriteError}`);
  }

  return `${lines.join('\n')}\n`;
}
