import { PROJECT_NAME_PATTERN, type Result, err, ok } from '@genesis/shared';
import type { ValidationIssue } from '@genesis/shared';

import {
  type EngineTarget,
  GENESIS_PROJECT_CONFIG_SCHEMA_VERSION,
  type GenesisProjectConfig,
  type PlatformTarget,
  type ProjectType,
  SUPPORTED_CONFIG_SCHEMA_VERSIONS,
  type ScriptLanguage,
} from '../domain/genesis-project-config.js';

const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const ENGINE_TARGETS: readonly EngineTarget[] = ['unity', 'generic'];
const PLATFORM_TARGETS: readonly PlatformTarget[] = ['mobile', 'desktop', 'web', 'console'];
const SCRIPT_LANGUAGES: readonly ScriptLanguage[] = ['csharp', 'typescript'];
const PROJECT_TYPES: readonly ProjectType[] = ['game'];

const REQUIRED_MODULES = ['assets', 'scripts', 'tests'] as const;

function issue(
  ruleId: string,
  severity: ValidationIssue['severity'],
  message: string,
  path?: string,
): ValidationIssue {
  return path !== undefined ? { ruleId, severity, message, path } : { ruleId, severity, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, path: string, issues: ValidationIssue[]): string | undefined {
  if (typeof value !== 'string' || value.length === 0) {
    issues.push(issue('CFG-001', 'error', `Expected non-empty string at ${path}`, path));
    return undefined;
  }
  return value;
}

export function validateGenesisConfig(
  input: unknown,
): Result<GenesisProjectConfig, ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  if (!isRecord(input)) {
    return err([issue('CFG-001', 'error', 'Config must be an object')]);
  }

  const schemaVersionRaw = input['schemaVersion'] ?? GENESIS_PROJECT_CONFIG_SCHEMA_VERSION;
  if (typeof schemaVersionRaw !== 'number') {
    issues.push(issue('CFG-001', 'error', 'schemaVersion must be a number', 'schemaVersion'));
    return err(issues);
  }

  if (!SUPPORTED_CONFIG_SCHEMA_VERSIONS.includes(schemaVersionRaw as 1)) {
    issues.push(
      issue(
        'CFG-001',
        'error',
        `Unsupported schemaVersion ${String(schemaVersionRaw)}. Supported: ${SUPPORTED_CONFIG_SCHEMA_VERSIONS.join(', ')}`,
        'schemaVersion',
      ),
    );
    return err(issues);
  }

  const project = input['project'];
  if (!isRecord(project)) {
    issues.push(issue('CFG-001', 'error', 'project must be an object', 'project'));
    return err(issues);
  }

  const name = readString(project['name'], 'project.name', issues);
  if (name && !PROJECT_NAME_PATTERN.test(name)) {
    issues.push(issue('CFG-002', 'error', 'project.name must be kebab-case', 'project.name'));
  }

  const version = readString(project['version'], 'project.version', issues);
  if (version && !SEMVER_PATTERN.test(version)) {
    issues.push(
      issue('CFG-003', 'error', 'project.version must be valid semver', 'project.version'),
    );
  }

  const type = readString(project['type'], 'project.type', issues);
  if (type && !PROJECT_TYPES.includes(type as ProjectType)) {
    issues.push(issue('CFG-004', 'error', "project.type must be 'game'", 'project.type'));
  }

  const engine = input['engine'];
  if (!isRecord(engine)) {
    issues.push(issue('CFG-001', 'error', 'engine must be an object', 'engine'));
  } else {
    const target = readString(engine['target'], 'engine.target', issues);
    if (target && !ENGINE_TARGETS.includes(target as EngineTarget)) {
      issues.push(issue('CFG-005', 'error', 'engine.target is invalid', 'engine.target'));
    }
  }

  const platforms = input['platforms'];
  if (!isRecord(platforms)) {
    issues.push(issue('CFG-001', 'error', 'platforms must be an object', 'platforms'));
  } else {
    const targets = platforms['targets'];
    if (!Array.isArray(targets) || targets.length === 0) {
      issues.push(
        issue(
          'CFG-006',
          'error',
          'platforms.targets must be a non-empty array',
          'platforms.targets',
        ),
      );
    } else {
      for (const [index, target] of targets.entries()) {
        if (typeof target !== 'string' || !PLATFORM_TARGETS.includes(target as PlatformTarget)) {
          issues.push(
            issue(
              'CFG-006',
              'error',
              `Invalid platform at platforms.targets[${index}]`,
              `platforms.targets[${index}]`,
            ),
          );
        }
      }
    }
  }

  const modules = input['modules'];
  if (!isRecord(modules)) {
    issues.push(issue('CFG-001', 'error', 'modules must be an object', 'modules'));
  } else {
    const enabled = modules['enabled'];
    if (!Array.isArray(enabled)) {
      issues.push(issue('CFG-001', 'error', 'modules.enabled must be an array', 'modules.enabled'));
    } else {
      for (const required of REQUIRED_MODULES) {
        if (!enabled.includes(required)) {
          issues.push(
            issue(
              'CFG-007',
              'warning',
              `modules.enabled should include '${required}'`,
              'modules.enabled',
            ),
          );
        }
      }
    }
  }

  const assets = input['assets'];
  if (!isRecord(assets)) {
    issues.push(issue('CFG-001', 'error', 'assets must be an object', 'assets'));
  } else {
    readString(assets['root'], 'assets.root', issues);
  }

  const scripts = input['scripts'];
  if (!isRecord(scripts)) {
    issues.push(issue('CFG-001', 'error', 'scripts must be an object', 'scripts'));
  } else {
    readString(scripts['root'], 'scripts.root', issues);
    const language = readString(scripts['language'], 'scripts.language', issues);
    if (language && !SCRIPT_LANGUAGES.includes(language as ScriptLanguage)) {
      issues.push(issue('CFG-001', 'error', 'scripts.language is invalid', 'scripts.language'));
    }
  }

  const genesis = input['genesis'];
  if (!isRecord(genesis)) {
    issues.push(issue('CFG-001', 'error', 'genesis must be an object', 'genesis'));
  } else {
    readString(genesis['version'], 'genesis.version', issues);
    readString(genesis['template'], 'genesis.template', issues);
    const createdAt = readString(genesis['createdAt'], 'genesis.createdAt', issues);
    if (createdAt && !ISO_DATE_PATTERN.test(createdAt)) {
      issues.push(
        issue('CFG-012', 'error', 'genesis.createdAt must be ISO 8601 UTC', 'genesis.createdAt'),
      );
    }
  }

  const errors = issues.filter((entry) => entry.severity === 'error');
  if (errors.length > 0) {
    return err(issues);
  }

  return ok(input as unknown as GenesisProjectConfig);
}
