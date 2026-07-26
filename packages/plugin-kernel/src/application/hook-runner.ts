import { GenesisError } from '@genesis/core';

import type { HookExecutionContext, HookRegistration } from '../domain/contributions.js';
import type { HookPoint } from '../domain/hooks.js';
import type { RegistryEntry } from '../domain/registry-entry.js';
import type { PluginRegistriesInternal } from './internal-registries.js';

export class HookExecutionError extends GenesisError {
  constructor(message: string, hookId: string) {
    super({ code: 'HOOK_EXECUTION', message, details: { hookId } });
    this.name = 'HookExecutionError';
  }
}

export class HookRunner {
  private readonly registries: PluginRegistriesInternal;

  constructor(registries: PluginRegistriesInternal) {
    this.registries = registries;
  }

  async run(
    point: HookPoint,
    payload: Readonly<Record<string, unknown>>,
    genesisVersion: string,
  ): Promise<void> {
    const hooks = this.registries.hooks
      .list()
      .filter((entry) => entry.value.point === point)
      .map((entry) => entry.value);

    for (const hook of hooks) {
      await this.executeHook(hook, payload, genesisVersion);
    }
  }

  async runAbortable(
    point: HookPoint,
    payload: Readonly<Record<string, unknown>>,
    genesisVersion: string,
  ): Promise<void> {
    const hooks = this.registries.hooks
      .list()
      .filter((entry) => entry.value.point === point)
      .map((entry) => entry.value);

    for (const hook of hooks) {
      try {
        await this.executeHook(hook, payload, genesisVersion);
      } catch (error) {
        throw new HookExecutionError(
          error instanceof Error ? error.message : String(error),
          hook.hookId,
        );
      }
    }
  }

  list(point: HookPoint): readonly RegistryEntry<HookRegistration>[] {
    return this.registries.hooks.list().filter((entry) => entry.value.point === point);
  }

  private async executeHook(
    hook: HookRegistration,
    payload: Readonly<Record<string, unknown>>,
    genesisVersion: string,
  ): Promise<void> {
    const context: HookExecutionContext = { genesisVersion, payload };
    await hook.handler(context);
  }
}
