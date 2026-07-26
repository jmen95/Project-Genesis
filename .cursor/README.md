
# Project Genesis - Cursor Workspace


## Purpose

This folder contains the AI operating system for Project Genesis.

It defines:

- How AI assistants behave.
- Project context.
- Development workflows.
- Architectural memory.



## Structure

```
.cursor/
├── rules/       Permanent AI behavior rules
├── context/     Current project knowledge (see context/README.md)
├── prompts/     Cursor workflow prompts
└── memories/    Decisions, lessons, known issues
```

## Key Files

| Path | Purpose |
|------|---------|
| [context/README.md](context/README.md) | Context directory index |
| [context/CURRENT_TASK.md](context/CURRENT_TASK.md) | Active engineering task |
| [../AI_ARCHITECT.md](../AI_ARCHITECT.md) | AI architect guide |
| [../DECISION_LOG.md](../DECISION_LOG.md) | Canonical architectural decisions |

## Prompt Systems

| Location | Purpose |
|----------|---------|
| `.cursor/prompts/` | Ready-to-use Cursor workflow prompts |
| `prompts/blocks/` | Composable prompt blocks |
| `prompts/templates/` | Task templates with `{{variables}}` |
| `prompts/workflows/` | Multi-step workflow scaffolds |

## How Cursor Should Work


Before implementing anything:


1. Read applicable rules.

2. Read current context.

3. Check previous decisions.

4. Create a plan.

5. Implement.

6. Test.

7. Document.



## Golden Rule


Never optimize for generating more code.

Optimize for building a maintainable system.

