import type {
  ITemplateProvider,
  ProjectTemplateDescriptor,
  TemplateSummary,
} from '../domain/template-provider.interface.js';
import type { ITemplateProviderRegistry } from './template-provider-registry.js';

export class CompositeTemplateProvider implements ITemplateProvider {
  private readonly registry: ITemplateProviderRegistry;
  private readonly builtInProvider: ITemplateProvider;

  constructor(registry: ITemplateProviderRegistry, builtInProvider: ITemplateProvider) {
    this.registry = registry;
    this.builtInProvider = builtInProvider;
  }

  async listTemplates(): Promise<readonly TemplateSummary[]> {
    const builtIn = await this.builtInProvider.listTemplates();
    const pluginSummaries: TemplateSummary[] = [];

    for (const registration of this.registry.listProviders()) {
      if (registration.source !== 'plugin') {
        continue;
      }
      const templates = await registration.provider.listTemplates();
      for (const template of templates) {
        if (!pluginSummaries.some((entry) => entry.id === template.id)) {
          pluginSummaries.push(template);
        }
      }
    }

    const merged = new Map<string, TemplateSummary>();
    for (const template of builtIn) {
      merged.set(template.id, template);
    }

    for (const template of pluginSummaries.sort((left, right) => left.id.localeCompare(right.id))) {
      if (!merged.has(template.id)) {
        merged.set(template.id, template);
      }
    }

    return [...merged.values()].sort((left, right) => left.id.localeCompare(right.id));
  }

  async loadProjectTemplate(templateId: string): Promise<ProjectTemplateDescriptor> {
    const pluginRegistrations = this.registry
      .listProviders()
      .filter((entry) => entry.source === 'plugin' && entry.templateId === templateId);

    if (pluginRegistrations.length > 0) {
      const sorted = [...pluginRegistrations].sort((left, right) => left.priority - right.priority);
      const winner = sorted[0];
      if (!winner) {
        throw new Error(`No plugin provider available for template: ${templateId}`);
      }
      return winner.provider.loadProjectTemplate(templateId);
    }

    return this.builtInProvider.loadProjectTemplate(templateId);
  }
}
