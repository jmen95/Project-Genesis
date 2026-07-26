import { describe, expect, it } from 'vitest';
import { createValidationReport } from './validation-report.js';

describe('createValidationReport', () => {
  it('marks success false when errors exist', () => {
    const report = createValidationReport([
      { ruleId: 'TEST-001', severity: 'error', message: 'failed' },
    ]);
    expect(report.success).toBe(false);
    expect(report.errorCount).toBe(1);
  });
});
