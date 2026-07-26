export type Brand<T, Tag extends string> = T & { readonly __brand: Tag };
