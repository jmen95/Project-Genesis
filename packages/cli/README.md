# @genesis/cli

Genesis CLI — the central command-line tool for Project Genesis.

## Responsibility

- User interaction and command parsing (Commander.js)
- CLI bootstrap and exit codes
- Presentation output (help, version, doctor)

## Commands (Sprint 1)

| Command | Description |
|---------|-------------|
| `genesis --help` | Show help |
| `genesis --version` | Show CLI and Node.js version |
| `genesis doctor` | Print environment information |

## Dependencies

- `@genesis/core`
- `@genesis/shared`
- `commander`

## Development

```bash
pnpm build
pnpm genesis --help
```

## Related

- [specs/001-cli/](../../specs/001-cli/) — CLI specification
