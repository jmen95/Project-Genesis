import type { GenesisPlugin, PluginManifest } from '@genesis/plugin-kernel';
import { PLUGIN_API_VERSION } from '@genesis/plugin-kernel';
import type { PluginContext } from '@genesis/plugin-kernel/internal';

import { PluginDefinitionError } from '../errors/plugin-definition.error.js';
import type {
  HookDefinition,
  HookPoint,
  PluginDefinition,
  PluginLogger,
  ValidatorDefinition,
} from '../types.js';
import { inferCapabilities } from './infer-capabilities.js';
import {
  readDiscoveredManifest,
  validateDefinitionMatchesManifest,
} from './validate-manifest-match.js';

function toLogger(logger: PluginContext['logger']): PluginLogger {
  return {
    info: (message) => logger.info(message),
    warn: (message) => logger.warn(message),
    error: (message) => logger.error(message),
  };
}

function scopedId(pluginId: string, shortId: string): string {
  return `${pluginId}:${shortId}`;
}

function normalizeHooks(
  hooks: PluginDefinition['hooks'],
): readonly { readonly point: HookPoint; readonly hook: HookDefinition }[] {
  if (!hooks) {
    return [];
  }

  const normalized: { point: HookPoint; hook: HookDefinition }[] = [];
  for (const [point, value] of Object.entries(hooks) as [
    HookPoint,
    HookDefinition | HookDefinition[],
  ][]) {
    if (Array.isArray(value)) {
      for (const hook of value) {
        normalized.push({ point, hook });
      }
    } else if (value) {
      normalized.push({ point, hook: value });
    }
  }
  return normalized;
}

function toValidationRule(pluginId: string, validator: ValidatorDefinition) {
  const ruleId = scopedId(pluginId, validator.id);
  return {
    id: ruleId,
    async validate(target: unknown) {
      let issues: readonly {
        readonly severity: string;
        readonly message: string;
        readonly path?: string;
      }[];
      if (validator.kind === 'project-config') {
        issues = await validator.validate({ kind: 'project-config', config: target });
      } else if (validator.kind === 'template-manifest') {
        issues = await validator.validate({ kind: 'template-manifest', manifest: target });
      } else {
        issues = await validator.validate({ kind: 'project-output', rootPath: String(target) });
      }

      return issues.map((issue) => ({
        ruleId,
        severity: issue.severity,
        message: issue.message,
        ...(issue.path !== undefined ? { path: issue.path } : {}),
      }));
    },
  };
}

function validateDefinitionShape(definition: PluginDefinition): void {
  if (!definition.id.trim()) {
    throw new PluginDefinitionError('PDEF-001', 'unknown', 'Plugin id is required', 'id');
  }
  if (!definition.version.trim()) {
    throw new PluginDefinitionError(
      'PDEF-001',
      definition.id,
      'Plugin version is required',
      'version',
    );
  }
  if (!definition.description.trim()) {
    throw new PluginDefinitionError(
      'PDEF-001',
      definition.id,
      'Plugin description is required',
      'description',
    );
  }
  if (!definition.genesisVersion.trim()) {
    throw new PluginDefinitionError(
      'PDEF-001',
      definition.id,
      'genesisVersion is required',
      'genesisVersion',
    );
  }

  const capabilities = inferCapabilities(definition);
  if (capabilities.length === 0) {
    throw new PluginDefinitionError(
      'PDEF-001',
      definition.id,
      'Plugin must declare at least one contribution (template, validator, hook, or command)',
    );
  }
}

function buildManifest(definition: PluginDefinition): PluginManifest {
  const capabilities = inferCapabilities(definition);
  return {
    name: definition.id,
    version: definition.version,
    apiVersion: '1.x',
    genesisVersion: definition.genesisVersion,
    description: definition.description,
    main: './dist/index.js',
    capabilities,
    ...(definition.templates && definition.templates.length > 0 ? { templates: 'templates' } : {}),
    ...(definition.dependencies ? { dependencies: definition.dependencies } : {}),
  };
}

export function toGenesisPlugin(definition: PluginDefinition): GenesisPlugin {
  validateDefinitionShape(definition);
  const manifest = buildManifest(definition);
  const hooks = normalizeHooks(definition.hooks);

  return {
    manifest,

    async onLoad(context: PluginContext): Promise<void> {
      try {
        const discovered = await readDiscoveredManifest(context.filesystem, context.pluginRoot);
        validateDefinitionMatchesManifest(definition, discovered);
      } catch (error) {
        if (error instanceof PluginDefinitionError) {
          const loadError = {
            pluginId: definition.id,
            stage: 'validate-definition' as const,
            reason: `${error.code}: ${error.message}`,
            cause: error,
          };
          throw Object.assign(new Error(loadError.reason), { pluginLoadError: loadError });
        }
        throw error;
      }

      if (definition.setup) {
        await definition.setup({
          pluginRoot: context.pluginRoot,
          genesisVersion: context.genesisVersion,
          logger: toLogger(context.logger),
        });
      }
    },

    register(context: PluginContext): void {
      for (const template of definition.templates ?? []) {
        context.registerTemplate({
          templateId: template.id,
          version: template.version,
          ...(template.description !== undefined ? { description: template.description } : {}),
          ...(template.priority !== undefined ? { priority: template.priority } : {}),
        });
      }

      for (const validator of definition.validators ?? []) {
        context.registerValidator({
          ruleId: scopedId(definition.id, validator.id),
          kind: validator.kind,
          rule: toValidationRule(definition.id, validator),
          ...(validator.priority !== undefined ? { priority: validator.priority } : {}),
        });
      }

      for (const command of definition.commands ?? []) {
        const logger = toLogger(context.logger);
        context.registerCommand({
          commandId: scopedId(definition.id, command.id),
          description: command.description,
          handler: async (handlerContext) => {
            await command.handler({
              args: handlerContext.args,
              logger,
            });
          },
          register: () => {
            return;
          },
        });
      }

      for (const { point, hook } of hooks) {
        const logger = toLogger(context.logger);
        context.registerHook({
          hookId: scopedId(definition.id, hook.id),
          point,
          ...(hook.priority !== undefined ? { priority: hook.priority } : {}),
          handler: async (executionContext) => {
            await hook.handler({
              genesisVersion: executionContext.genesisVersion,
              payload: executionContext.payload,
              logger,
            });
          },
        });
      }
    },

    async onUnload(): Promise<void> {
      if (definition.teardown) {
        await definition.teardown();
      }
    },
  };
}

export function getDefinitionMetadata(definition: PluginDefinition): {
  readonly manifest: PluginManifest;
  readonly capabilities: readonly string[];
} {
  validateDefinitionShape(definition);
  const manifest = buildManifest(definition);
  return {
    manifest,
    capabilities: manifest.capabilities ?? [],
  };
}

export { PLUGIN_API_VERSION };
