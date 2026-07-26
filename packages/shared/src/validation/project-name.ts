import { type Result, err, ok } from '../types/result.js';

export const PROJECT_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

export const RESERVED_PROJECT_NAMES: readonly string[] = [
  'genesis',
  'node_modules',
  'dist',
  'core',
  'test',
  'tests',
  'template',
  'templates',
];

const MIN_PROJECT_NAME_LENGTH = 2;
const MAX_PROJECT_NAME_LENGTH = 64;

export function validateProjectName(name: string): Result<string, string> {
  const trimmed = name.trim();

  if (trimmed.length < MIN_PROJECT_NAME_LENGTH) {
    return err(`Project name must be at least ${MIN_PROJECT_NAME_LENGTH} characters`);
  }

  if (trimmed.length > MAX_PROJECT_NAME_LENGTH) {
    return err(`Project name must be at most ${MAX_PROJECT_NAME_LENGTH} characters`);
  }

  if (!PROJECT_NAME_PATTERN.test(trimmed)) {
    return err(
      'Project name must be kebab-case: lowercase letters, digits, and hyphens; start with a letter',
    );
  }

  if (trimmed.startsWith('-') || trimmed.endsWith('-') || trimmed.includes('--')) {
    return err('Project name cannot start or end with a hyphen or contain consecutive hyphens');
  }

  if (RESERVED_PROJECT_NAMES.includes(trimmed)) {
    return err(`Project name "${trimmed}" is reserved`);
  }

  return ok(trimmed);
}
