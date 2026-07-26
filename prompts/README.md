# Prompt Engine

Project Genesis uses two complementary prompt systems.

## Cursor Workflows

**[.cursor/prompts/](../.cursor/prompts/)** — Ready-to-use prompts for Cursor agents. Start here for interactive development.

## Composable Prompts

This directory provides building blocks for programmatic prompt assembly:

| Directory | Purpose |
|-----------|---------|
| [blocks/](blocks/) | Reusable blocks (architecture, security, testing, etc.) |
| [templates/](templates/) | Task-specific scaffolds with `{{variable}}` placeholders |
| [workflows/](workflows/) | Multi-step workflow prompts |
| [examples/](examples/) | Example prompts for common game dev tasks |

## Assembly

A prompt is assembled from blocks:

```
blocks/current-context.md
+ blocks/architecture.md
+ blocks/constraints.md
+ blocks/task.md
+ blocks/output-format.md
```

Templates reference these blocks.
