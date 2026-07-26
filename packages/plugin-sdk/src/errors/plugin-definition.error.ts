export type PluginDefinitionErrorCode = 'PDEF-001' | 'PDEF-002' | 'PDEF-003';

export class PluginDefinitionError extends Error {
  readonly code: PluginDefinitionErrorCode;
  readonly pluginId: string;
  readonly field?: string;

  constructor(code: PluginDefinitionErrorCode, pluginId: string, message: string, field?: string) {
    super(message);
    this.name = 'PluginDefinitionError';
    this.code = code;
    this.pluginId = pluginId;
    if (field !== undefined) {
      this.field = field;
    }
  }
}
