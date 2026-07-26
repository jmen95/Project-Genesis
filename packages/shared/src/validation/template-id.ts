import { type Result, err, ok } from '../types/result.js';

export const TEMPLATE_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

const MIN_TEMPLATE_ID_LENGTH = 1;
const MAX_TEMPLATE_ID_LENGTH = 64;

export function validateTemplateId(id: string): Result<string, string> {
  const trimmed = id.trim();

  if (trimmed.length < MIN_TEMPLATE_ID_LENGTH) {
    return err('Template id is required');
  }

  if (trimmed.length > MAX_TEMPLATE_ID_LENGTH) {
    return err(`Template id must be at most ${MAX_TEMPLATE_ID_LENGTH} characters`);
  }

  if (!TEMPLATE_ID_PATTERN.test(trimmed)) {
    return err('Template id must be kebab-case: lowercase letters, digits, and hyphens');
  }

  return ok(trimmed);
}
