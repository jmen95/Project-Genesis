import type { ValidationIssue, ValidationSeverity } from '@genesis/shared';

export type HookPoint =
  | 'beforeProjectCreate'
  | 'afterProjectCreate'
  | 'beforeValidation'
  | 'afterValidation';

export type ValidationTargetKind = 'project-config' | 'template-manifest' | 'project-output';

export interface PluginLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface PluginSetupContext {
  readonly pluginRoot: string;
  readonly genesisVersion: string;
  readonly logger: PluginLogger;
}

export interface TemplateDefinition {
  readonly id: string;
  readonly version: string;
  readonly description?: string;
  readonly priority?: number;
}

export interface ValidatorDefinition {
  readonly id: string;
  readonly kind: ValidationTargetKind;
  readonly priority?: number;
  readonly validate: (
    target: ValidatorTarget,
  ) => readonly ValidationIssueInput[] | Promise<readonly ValidationIssueInput[]>;
}

export type ValidatorTarget =
  | { readonly kind: 'project-config'; readonly config: unknown }
  | { readonly kind: 'template-manifest'; readonly manifest: unknown }
  | { readonly kind: 'project-output'; readonly rootPath: string };

export interface ValidationIssueInput {
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly path?: string;
}

export interface CommandDefinition {
  readonly id: string;
  readonly description: string;
  readonly handler: (context: CommandContext) => void | Promise<void>;
}

export interface CommandContext {
  readonly args: readonly string[];
  readonly logger: PluginLogger;
}

export interface HookDefinition<TPayload = Readonly<Record<string, unknown>>> {
  readonly id: string;
  readonly priority?: number;
  readonly handler: (context: HookContext<TPayload>) => void | Promise<void>;
}

export interface HookContext<TPayload = Readonly<Record<string, unknown>>> {
  readonly genesisVersion: string;
  readonly payload: TPayload;
  readonly logger: PluginLogger;
}

export interface PluginDefinition {
  readonly id: string;
  readonly version: string;
  readonly description: string;
  readonly genesisVersion: string;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly templates?: readonly TemplateDefinition[];
  readonly validators?: readonly ValidatorDefinition[];
  readonly commands?: readonly CommandDefinition[];
  readonly hooks?: Partial<Record<HookPoint, HookDefinition | readonly HookDefinition[]>>;
  readonly setup?: (context: PluginSetupContext) => void | Promise<void>;
  readonly teardown?: () => void | Promise<void>;
}

export type { ValidationIssue, ValidationSeverity };
