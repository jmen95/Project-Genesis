export type {
  IValidationRule,
  IValidationRegistry,
  IValidationService,
  ValidationTarget,
} from './domain/validation.interface.js';
export {
  RegistryValidationService,
  ValidationService,
  createRegistryValidationService,
  createDefaultValidationService,
} from './application/validation-service.js';
