# Naming Standard

Mandatory naming conventions for Project Genesis code, files, and folders.

## Summary

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `TemplateEngine` |
| Interfaces | PascalCase (no `I` prefix) | `FileSystem` |
| Methods | camelCase | `renderTemplate` |
| Variables | camelCase | `projectName` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Files (TS) | kebab-case | `template-engine.ts` |
| Folders | kebab-case | `template-engine/` |
| Packages | `@genesis/<name>` | `@genesis/core` |

## Detailed Standards

| Topic | Document |
|-------|----------|
| Classes | [naming/classes.md](naming/classes.md) |
| Methods | [naming/methods.md](naming/methods.md) |
| Files | [naming/files.md](naming/files.md) |
| Folders | [naming/folders.md](naming/folders.md) |

## Related

- [CODING_STANDARD.md](CODING_STANDARD.md) — General coding rules
- [GIT_STANDARD.md](GIT_STANDARD.md) — Branch and commit naming
