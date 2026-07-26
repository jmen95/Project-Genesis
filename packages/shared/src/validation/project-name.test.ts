import { describe, expect, it } from 'vitest';
import { validateProjectName } from './project-name.js';

describe('validateProjectName', () => {
  it('accepts valid kebab-case names', () => {
    expect(validateProjectName('my-game').ok).toBe(true);
    expect(validateProjectName('ocean-quest-2').ok).toBe(true);
  });

  it('rejects invalid casing and characters', () => {
    expect(validateProjectName('My-Game').ok).toBe(false);
    expect(validateProjectName('my_game').ok).toBe(false);
  });

  it('rejects reserved names', () => {
    expect(validateProjectName('genesis').ok).toBe(false);
  });

  it('rejects hyphen edge cases', () => {
    expect(validateProjectName('-game').ok).toBe(false);
    expect(validateProjectName('game-').ok).toBe(false);
    expect(validateProjectName('my--game').ok).toBe(false);
  });
});
