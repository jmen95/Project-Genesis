import { describe, expect, it } from 'vitest';
import { collectDoctorReport, formatDoctorOutput } from '../presentation/doctor-output.js';

describe('doctor output', () => {
  it('collects environment information', () => {
    const report = collectDoctorReport();
    expect(report.cliVersion).toMatch(/^\d+\.\d+\.\d+$/);
    expect(report.nodeVersion).toBe(process.version);
    expect(report.cwd).toBe(process.cwd());
  });

  it('formats doctor report for display', () => {
    const report = collectDoctorReport();
    const output = formatDoctorOutput(report, { useColor: false });
    expect(output).toContain('Environment');
    expect(output).toContain('CLI Version');
    expect(output).toContain('Node.js');
  });
});
