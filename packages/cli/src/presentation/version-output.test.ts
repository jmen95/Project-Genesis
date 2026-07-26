import { describe, expect, it } from 'vitest';
import { formatVersionOutput } from '../presentation/version-output.js';
import { getCliVersion } from '../version.js';

describe('version output', () => {
  it('reads version from package.json', () => {
    expect(getCliVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('formats version output with node runtime', () => {
    const output = formatVersionOutput({ useColor: false });
    expect(output).toContain('genesis v');
    expect(output).toContain(`node ${process.version}`);
  });
});
