import type { HookPoint } from './hooks.js';

export interface TemplateRegistration {
  readonly templateId: string;
  readonly version: string;
  readonly description?: string;
  readonly priority?: number;
  readonly provider?: unknown;
}

export type ValidationTargetKind = 'project-config' | 'template-manifest' | 'project-output';

export interface ValidatorRegistration {
  readonly ruleId: string;
  readonly kind: ValidationTargetKind;
  readonly priority?: number;
  readonly rule: unknown;
}

export interface CommandRegistration {
  readonly commandId: string;
  readonly description: string;
  readonly handler?: (context: CommandHandlerContext) => void | Promise<void>;
  readonly register: (program: unknown) => void;
}

export interface CommandHandlerContext {
  readonly args: readonly string[];
  readonly logger: {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
  };
}

export type HookHandler = (context: HookExecutionContext) => void | Promise<void>;

export interface HookRegistration {
  readonly hookId: string;
  readonly point: HookPoint;
  readonly priority?: number;
  readonly handler: HookHandler;
}

export interface HookExecutionContext {
  readonly genesisVersion: string;
  readonly payload: Readonly<Record<string, unknown>>;
}
