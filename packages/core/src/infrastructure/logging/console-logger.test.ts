import { describe, expect, it } from 'vitest';
import { ConsoleLogger } from './console-logger.js';

describe('ConsoleLogger', () => {
  it('records entries at or above the configured level', () => {
    const logger = new ConsoleLogger({ component: 'test' }, 'warn');
    logger.debug('hidden');
    logger.info('hidden');
    logger.warn('visible');
    logger.error('visible');

    const entries = logger.getEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0]?.level).toBe('warn');
    expect(entries[1]?.level).toBe('error');
  });

  it('creates child loggers with merged bindings', () => {
    const parent = new ConsoleLogger({ component: 'parent' });
    const child = parent.child({ requestId: 'abc' });
    child.info('child message');

    const entries = child.getEntries();
    expect(entries[0]?.meta).toMatchObject({ component: 'parent', requestId: 'abc' });
  });
});
