import type { ITemplateProvider, TemplateSummary } from '../domain/template-provider.interface.js';

export interface TemplateProviderRegistration {
  readonly templateId: string;
  readonly version: string;
  readonly description?: string;
  readonly priority: number;
  readonly source: 'builtin' | 'plugin';
  readonly pluginId?: string;
  readonly provider: ITemplateProvider;
}

export interface ITemplateProviderRegistry {
  registerBuiltIn(provider: ITemplateProvider, options?: { readonly priority?: number }): void;
  registerPlugin(
    registration: Omit<TemplateProviderRegistration, 'source' | 'priority'> & {
      readonly priority?: number;
      readonly pluginId: string;
    },
  ): void;
  resolveProvider(templateId: string): ITemplateProvider;
  listProviders(): readonly TemplateProviderRegistration[];
}

export class TemplateProviderRegistry implements ITemplateProviderRegistry {
  private readonly byTemplateId = new Map<string, TemplateProviderRegistration[]>();

  registerBuiltIn(provider: ITemplateProvider, options?: { readonly priority?: number }): void {
    void provider;
    void options;
    // Built-in templates are resolved via filesystem provider directly in CompositeTemplateProvider
  }

  registerPlugin(
    registration: Omit<TemplateProviderRegistration, 'source' | 'priority'> & {
      readonly priority?: number;
      readonly pluginId: string;
    },
  ): void {
    const entry: TemplateProviderRegistration = {
      templateId: registration.templateId,
      version: registration.version,
      provider: registration.provider,
      source: 'plugin',
      pluginId: registration.pluginId,
      priority: registration.priority ?? 100,
      ...(registration.description !== undefined ? { description: registration.description } : {}),
    };

    const existing = this.byTemplateId.get(registration.templateId) ?? [];
    if (
      existing.some((item) => item.source === 'plugin' && item.pluginId === registration.pluginId)
    ) {
      throw new Error(`Duplicate plugin template registration: ${registration.templateId}`);
    }
    if (existing.length > 0) {
      throw new Error(`Duplicate template id: ${registration.templateId}`);
    }

    this.byTemplateId.set(registration.templateId, [...existing, entry]);
  }

  resolveProvider(templateId: string): ITemplateProvider {
    const entries = this.byTemplateId.get(templateId);
    if (!entries || entries.length === 0) {
      throw new Error(`No provider registered for template: ${templateId}`);
    }

    const sorted = [...entries].sort((left, right) => left.priority - right.priority);
    const pluginEntry = sorted.find((entry) => entry.source === 'plugin');
    if (pluginEntry) {
      return pluginEntry.provider;
    }
    const winner = sorted[0];
    if (!winner) {
      throw new Error(`No provider registered for template: ${templateId}`);
    }
    return winner.provider;
  }

  listProviders(): readonly TemplateProviderRegistration[] {
    return [...this.byTemplateId.values()].flat().sort((left, right) => {
      if (left.templateId !== right.templateId) {
        return left.templateId.localeCompare(right.templateId);
      }
      return left.priority - right.priority;
    });
  }

  registerTemplateMapping(templateId: string, registration: TemplateProviderRegistration): void {
    const existing = this.byTemplateId.get(templateId) ?? [];
    if (existing.length > 0) {
      throw new Error(`Duplicate template id: ${templateId}`);
    }
    this.byTemplateId.set(templateId, [registration]);
  }

  getRegistrations(templateId: string): readonly TemplateProviderRegistration[] {
    return this.byTemplateId.get(templateId) ?? [];
  }
}
