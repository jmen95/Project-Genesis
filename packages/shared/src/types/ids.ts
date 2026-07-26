import type { Brand } from '../types/branded.js';

export type ProjectName = Brand<string, 'ProjectName'>;
export type PluginId = Brand<string, 'PluginId'>;
export type TemplateId = Brand<string, 'TemplateId'>;

export function createProjectName(value: string): ProjectName {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new RangeError('Project name cannot be empty');
  }
  return trimmed as ProjectName;
}
