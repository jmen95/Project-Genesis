# GitHub Templates

Canonical content for GitHub issue and pull request templates. When implemented, these map to `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md`.

**Full workflow specification:** [governance/GITHUB_WORKFLOW.md](../../governance/GITHUB_WORKFLOW.md)

## Templates

| Template | File | GitHub issue form (future) |
|----------|------|----------------------------|
| Bug report | [bug-report.md](bug-report.md) | `ISSUE_TEMPLATE/bug_report.yml` |
| Feature request | [feature-request.md](feature-request.md) | `ISSUE_TEMPLATE/feature_request.yml` |
| RFC | [rfc.md](rfc.md) | `ISSUE_TEMPLATE/rfc.yml` |
| Blank issue | [issue.md](issue.md) | Fallback / config redirect |
| Pull request | [pull-request.md](pull-request.md) | `.github/pull_request_template.md` |

## Implementation mapping

| Spec location | Future GitHub path |
|---------------|-------------------|
| `templates/github/*.md` | `.github/ISSUE_TEMPLATE/*.yml` body content |
| [governance/GITHUB_WORKFLOW.md](../../governance/GITHUB_WORKFLOW.md) | Labels, milestones, projects, protection |
| [governance/GITHUB_WORKFLOW.md#dependabot](../../governance/GITHUB_WORKFLOW.md#dependabot) | `.github/dependabot.yml` |
| [governance/GITHUB_WORKFLOW.md#codeowners](../../governance/GITHUB_WORKFLOW.md#code-owners) | `.github/CODEOWNERS` |
| [.github/README.md](../../.github/README.md) | CI workflows |

## Related

- [../README.md](../README.md) — Template library index
- [governance/PULL_REQUEST_PROCESS.md](../../governance/PULL_REQUEST_PROCESS.md) — PR lifecycle
- [specs/000-project/QUALITY_GATES.md](../../specs/000-project/QUALITY_GATES.md) — PR quality gates
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — Contribution guide
