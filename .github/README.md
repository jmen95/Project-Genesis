# GitHub Configuration

CI/CD workflows and GitHub-specific configuration for Project Genesis.

> **Specification:** All GitHub platform design (labels, milestones, projects, templates, protection, Dependabot, releases) is defined in [governance/GITHUB_WORKFLOW.md](../governance/GITHUB_WORKFLOW.md). This directory holds **implementation** assets when the monorepo is bootstrapped.

## Planned structure

```
.github/
├── README.md                 # This file
├── CODEOWNERS                # Path ownership (spec in GITHUB_WORKFLOW.md)
├── dependabot.yml            # Dependency updates (spec in GITHUB_WORKFLOW.md)
├── pull_request_template.md  # Mirrors templates/github/pull-request.md
├── ISSUE_TEMPLATE/
│   ├── config.yml
│   ├── bug_report.yml
│   ├── feature_request.yml
│   └── rfc.yml
└── workflows/
    ├── ci.yml                # lint, test, build
    ├── release.yml           # tag v* → npm + GitHub Release
    └── nightly.yml           # nightly channel (optional)
```

## Workflows (planned)

| Workflow | File | Purpose |
|----------|------|---------|
| CI | `workflows/ci.yml` | Lint, format, test, build on PR and main |
| Release | `workflows/release.yml` | Publish on tag `v*` |
| Nightly | `workflows/nightly.yml` | Nightly artifacts |

Implementation target: [Sprint 2](../.cursor/context/CURRENT_SPRINT.md).

## Template sources

| Asset | Canonical content |
|-------|-------------------|
| Issue templates | [templates/github/](../templates/github/) |
| PR template | [templates/github/pull-request.md](../templates/github/pull-request.md) |

## Related

- [governance/GITHUB_WORKFLOW.md](../governance/GITHUB_WORKFLOW.md) — **GitHub workflow specification**
- [governance/PULL_REQUEST_PROCESS.md](../governance/PULL_REQUEST_PROCESS.md) — PR process
- [governance/RELEASE_STRATEGY.md](../governance/RELEASE_STRATEGY.md) — Release channels
- [governance/BRANCHING_STRATEGY.md](../governance/BRANCHING_STRATEGY.md) — Branch protection context
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Pull request guidelines
- [standards/GIT_STANDARD.md](../standards/GIT_STANDARD.md) — Commits and branches
