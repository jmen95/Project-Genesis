export interface RegistryEntry<T> {
  readonly id: string;
  readonly pluginId: string;
  readonly pluginVersion: string;
  readonly priority: number;
  readonly contributedAt: string;
  readonly value: T;
}
