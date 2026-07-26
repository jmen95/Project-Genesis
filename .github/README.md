# GitHub Configuration

CI/CD workflows and GitHub-specific configuration for Project Genesis.

## Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| Build | [workflows/build.yml](workflows/build.yml) | Compile all packages |
| Test | [workflows/test.yml](workflows/test.yml) | Run test suite |
| Release | [workflows/release.yml](workflows/release.yml) | Publish releases |

> Workflows are scaffolded and will be configured during [Sprint 2](../.cursor/context/CURRENT_SPRINT.md).

## Related

- [../CONTRIBUTING.md](../CONTRIBUTING.md) — Pull request guidelines
- [../standards/GIT_STANDARD.md](../standards/GIT_STANDARD.md) — Branching and commits
- [../standards/release/deployment.md](../standards/release/deployment.md) — Deployment rules
