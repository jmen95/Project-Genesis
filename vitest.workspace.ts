import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/shared',
  'packages/core',
  'packages/config',
  'packages/validator',
  'packages/template-engine',
  'packages/plugin-kernel',
  'packages/plugin-sdk',
  'packages/scaffolding',
  'packages/cli',
  'packages/plugins/example',
]);
