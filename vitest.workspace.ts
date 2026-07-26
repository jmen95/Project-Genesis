import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/shared',
  'packages/core',
  'packages/config',
  'packages/validator',
  'packages/template-engine',
  'packages/scaffolding',
  'packages/cli',
]);
