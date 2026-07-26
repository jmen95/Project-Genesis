export function kebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function pascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

export function camelCase(value: string): string {
  const pascal = pascalCase(value);
  if (pascal.length === 0) {
    return '';
  }
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function snakeCase(value: string): string {
  return kebabCase(value).replace(/-/g, '_');
}
