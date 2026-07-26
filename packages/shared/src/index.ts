export type { Brand } from './types/branded.js';
export type { ProjectName, PluginId, TemplateId } from './types/ids.js';
export { createProjectName } from './types/ids.js';
export type { Result } from './types/result.js';
export { ok, err, isOk, isErr } from './types/result.js';
export { FRAMEWORK_NAME, PACKAGE_SCOPE } from './constants/framework.js';
export { assertNever } from './utils/assert-never.js';
export { kebabCase, pascalCase, camelCase } from './utils/naming.js';
