export const EXIT_SUCCESS = 0 as const;
export const EXIT_ERROR = 1 as const;
export const EXIT_INVALID_ARGUMENT = 2 as const;
export const EXIT_VALIDATION_FAILURE = 3 as const;

export type ExitCode =
  | typeof EXIT_SUCCESS
  | typeof EXIT_ERROR
  | typeof EXIT_INVALID_ARGUMENT
  | typeof EXIT_VALIDATION_FAILURE;
