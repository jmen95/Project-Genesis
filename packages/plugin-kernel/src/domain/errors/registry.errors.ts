import { GenesisError } from '@genesis/core';

export type RegistryErrorCode = 'REG-001' | 'REG-002' | 'REG-003' | 'REG-004';

export class RegistryError extends GenesisError {
  readonly registryCode: RegistryErrorCode;

  constructor(code: RegistryErrorCode, message: string) {
    super({ code, message });
    this.name = 'RegistryError';
    this.registryCode = code;
  }
}
