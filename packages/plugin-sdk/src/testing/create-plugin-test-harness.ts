import type { GenesisPlugin } from '@genesis/plugin-kernel';
import type { PluginContext } from '@genesis/plugin-kernel/internal';

import { getDefinitionMetadata } from '../internal/to-genesis-plugin.js';
import type { HookPoint, PluginDefinition, ValidationTargetKind } from '../types.js';

export interface PluginTestHarness {
  readonly capabilities: readonly string[];
  readonly templateIds: readonly string[];
  readonly validatorIds: readonly string[];
  readonly hookIds: readonly string[];
  readonly commandIds: readonly string[];
  runValidator(
    kind: ValidationTargetKind,
    target: unknown,
  ): Promise<
    readonly { readonly ruleId: string; readonly severity: string; readonly message: string }[]
  >;
  runHook(point: HookPoint, payload: Readonly<Record<string, unknown>>): Promise<void>;
}

export interface CreatePluginTestHarnessOptions {
  readonly plugin: GenesisPlugin;
  readonly definition?: PluginDefinition;
  readonly genesisVersion?: string;
}

interface RegisteredValidator {
  readonly ruleId: string;
  readonly kind: ValidationTargetKind;
  readonly validate: (
    target: unknown,
  ) => Promise<
    readonly { readonly ruleId: string; readonly severity: string; readonly message: string }[]
  >;
}

interface RegisteredHook {
  readonly hookId: string;
  readonly point: HookPoint;
  readonly handler: (context: {
    readonly genesisVersion: string;
    readonly payload: Readonly<Record<string, unknown>>;
    readonly logger: { info(): void; warn(): void; error(): void };
  }) => void | Promise<void>;
}

/**
 * Creates a small test harness for plugin definitions.
 *
 * Validates contribution metadata and runs validators/hooks in isolation.
 * Does not simulate the full CLI runtime — use integration tests for that.
 */
export function createPluginTestHarness(
  options: CreatePluginTestHarnessOptions,
): PluginTestHarness {
  const genesisVersion = options.genesisVersion ?? '0.1.0';
  const logger = {
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
  };

  const templates: string[] = [];
  const validators: RegisteredValidator[] = [];
  const hooks: RegisteredHook[] = [];
  const commands: string[] = [];

  const context = {
    manifest: options.plugin.manifest,
    pluginRoot: '/tmp/plugin-test',
    genesisVersion,
    logger,
    filesystem: {
      async exists() {
        return true;
      },
      async read() {
        return JSON.stringify({
          name: options.plugin.manifest.name,
          version: options.plugin.manifest.version,
          genesisVersion: options.plugin.manifest.genesisVersion,
        });
      },
    },
    registerTemplate(contribution: { templateId: string }) {
      templates.push(contribution.templateId);
    },
    registerValidator(contribution: {
      ruleId: string;
      kind: ValidationTargetKind;
      rule: { validate: (target: unknown) => Promise<unknown> };
    }) {
      validators.push({
        ruleId: contribution.ruleId,
        kind: contribution.kind,
        async validate(target) {
          const issues = (await contribution.rule.validate(target)) as readonly {
            readonly ruleId: string;
            readonly severity: string;
            readonly message: string;
          }[];
          return issues;
        },
      });
    },
    registerCommand(contribution: { commandId: string }) {
      commands.push(contribution.commandId);
    },
    registerHook(contribution: RegisteredHook) {
      hooks.push(contribution);
    },
  };

  options.plugin.register(context as unknown as PluginContext);

  const metadata = options.definition
    ? getDefinitionMetadata(options.definition)
    : { capabilities: options.plugin.manifest.capabilities ?? [] };

  return {
    capabilities: metadata.capabilities,
    templateIds: templates,
    validatorIds: validators.map((validator) => validator.ruleId),
    hookIds: hooks.map((hook) => hook.hookId),
    commandIds: commands,

    async runValidator(kind, target) {
      const validator = validators.find((entry) => entry.kind === kind);
      if (!validator) {
        throw new Error(`No validator registered for kind: ${kind}`);
      }
      return validator.validate(target);
    },

    async runHook(point, payload) {
      const matching = hooks.filter((hook) => hook.point === point);
      if (matching.length === 0) {
        throw new Error(`No hook registered for point: ${point}`);
      }
      for (const hook of matching) {
        await hook.handler({ genesisVersion, payload, logger });
      }
    },
  };
}
