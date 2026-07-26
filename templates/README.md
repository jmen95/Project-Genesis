# Templates

Document and code generation templates for Project Genesis.

## Purpose

Templates in this directory are **static authoring scaffolds** used by humans and AI to create consistent documents, modules, and project structures. They are not runtime templates.

> **Note:** Runtime template rendering will live in `packages/template-engine/` (planned). The `packages/templates/` directory is reserved for packaged runtime templates. See [packages/README.md](../packages/README.md).

## Categories

| Category | Path | Use |
|----------|------|-----|
| Engineering | [engineering/](engineering/) | ADRs, RFCs, APIs, modules |
| Documents | [documents/](documents/) | READMEs, roadmaps, glossaries |
| Backend | [backend/](backend/) | NestJS modules, services, controllers |
| Unity | [unity/](unity/) | Scenes, prefabs, systems |
| Game Design | [game-design/](game-design/) | GDDs, loops, economy |
| AI | [ai/](ai/) | Prompts, workflows, guardrails |
| Production | [production/](production/) | Sprints, milestones, releases |
| Planning | [planning/](planning/) | Epics, stories, backlogs |
| GitHub | [github/](github/) | Issues, pull requests |
| Generators | [generators/](generators/) | Generator configuration |

## Status

Template files are scaffolds with `status: Draft`. Populate them as each domain is implemented.

## Related

- [../prompts/](../prompts/) — Composable AI prompt blocks
- [../.cursor/prompts/](../.cursor/prompts/) — Cursor workflow prompts
- [../standards/DOCUMENTATION_STANDARD.md](../standards/DOCUMENTATION_STANDARD.md) — Document requirements
