import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/shared',
  'packages/core',
  'packages/template-engine',
  'packages/scaffolding',
  'packages/cli',
]);
