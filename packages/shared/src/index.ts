export type { Brand } from './types/branded.js';
export type { ProjectName, PluginId, TemplateId } from './types/ids.js';
export { createProjectName } from './types/ids.js';
export type { Result } from './types/result.js';
export { ok, err, isOk, isErr } from './types/result.js';
export { FRAMEWORK_NAME, PACKAGE_SCOPE } from './constants/framework.js';
export { assertNever } from './utils/assert-never.js';
export { kebabCase, pascalCase, camelCase, snakeCase } from './utils/naming.js';
export {
  PROJECT_NAME_PATTERN,
  RESERVED_PROJECT_NAMES,
  validateProjectName,
} from './validation/project-name.js';
export type {
  ValidationIssue,
  ValidationReport,
  ValidationSeverity,
} from './validation/validation-report.js';
export { createValidationReport } from './validation/validation-report.js';
