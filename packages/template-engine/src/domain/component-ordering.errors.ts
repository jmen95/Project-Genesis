import { ConfigurationError } from '@genesis/core';

export type ComponentOrderingErrorCode = 'COMP-001' | 'COMP-002' | 'COMP-003';

export class ComponentOrderingError extends ConfigurationError {
  readonly componentCode: ComponentOrderingErrorCode;

  constructor(code: ComponentOrderingErrorCode, message: string) {
    super(message, { code });
    this.name = 'ComponentOrderingError';
    this.componentCode = code;
  }
}
