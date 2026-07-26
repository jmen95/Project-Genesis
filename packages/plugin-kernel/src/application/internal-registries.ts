import type {
  CommandRegistration,
  HookRegistration,
  TemplateRegistration,
  ValidatorRegistration,
} from '../domain/contributions.js';
import { RegistryError } from '../domain/errors/registry.errors.js';
import type { PluginCapability } from '../domain/plugin-capability.js';
import type { RegistryEntry } from '../domain/registry-entry.js';

const DEFAULT_PRIORITY = 100;
const MAX_PRIORITY = 1000;

interface RegisterOptions {
  readonly pluginId: string;
  readonly pluginVersion: string;
  readonly loadOrder: number;
  readonly capabilities: readonly PluginCapability[];
}

export class InternalRegistry<T> {
  private readonly entries: RegistryEntry<T>[] = [];
  private readonly capability: PluginCapability;
  private registrationOpen = true;

  constructor(capability: PluginCapability) {
    this.capability = capability;
  }

  closeRegistration(): void {
    this.registrationOpen = false;
  }

  register(id: string, value: T, options: RegisterOptions & { readonly priority?: number }): void {
    if (!this.registrationOpen) {
      throw new RegistryError('REG-003', 'Registration after load phase completed');
    }

    if (!options.capabilities.includes(this.capability)) {
      throw new RegistryError(
        'REG-002',
        `Capability "${this.capability}" is not declared in plugin manifest`,
      );
    }

    const priority = options.priority ?? DEFAULT_PRIORITY;
    if (priority < 0 || priority > MAX_PRIORITY) {
      throw new RegistryError('REG-004', `Invalid priority ${priority}`);
    }

    if (this.entries.some((entry) => entry.id === id)) {
      throw new RegistryError('REG-001', `Duplicate entry id "${id}" in registry`);
    }

    this.entries.push({
      id,
      pluginId: options.pluginId,
      pluginVersion: options.pluginVersion,
      priority,
      contributedAt: new Date().toISOString(),
      value,
    });
  }

  list(): readonly RegistryEntry<T>[] {
    return [...this.entries].sort((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }
      if (left.pluginId !== right.pluginId) {
        return left.pluginId.localeCompare(right.pluginId);
      }
      return left.id.localeCompare(right.id);
    });
  }
}

export class PluginRegistriesInternal {
  readonly templates = new InternalRegistry<TemplateRegistration>('template');
  readonly validators = new InternalRegistry<ValidatorRegistration>('validator');
  readonly commands = new InternalRegistry<CommandRegistration>('command');
  readonly hooks = new InternalRegistry<HookRegistration>('hook');

  closeRegistration(): void {
    this.templates.closeRegistration();
    this.validators.closeRegistration();
    this.commands.closeRegistration();
    this.hooks.closeRegistration();
  }
}
