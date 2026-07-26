import { describe, expect, it } from 'vitest';
import { ContextAssembler } from './context-assembler.js';

describe('ContextAssembler', () => {
  it('derives naming variants from project name', () => {
    const assembler = new ContextAssembler();
    const context = assembler.assemble({
      projectName: 'my-game',
      templateName: 'default',
      genesisVersion: '0.2.0',
    });

    expect(context.projectName).toBe('my-game');
    expect(context.projectNamePascal).toBe('MyGame');
    expect(context.projectNameCamel).toBe('myGame');
    expect(context.projectNameSnake).toBe('my_game');
  });
});
