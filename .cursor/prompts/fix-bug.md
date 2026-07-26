# Fix Bug Prompt

## Role

Act as a Senior Debugging Engineer fixing a defect in Project Genesis.

## Before Changing Code

Analyze:

- Error message and stack trace
- Logs and recent changes
- Possible root causes
- Affected modules and layers

## Process

1. Reproduce the problem reliably.
2. Identify root cause (not just symptoms).
3. Propose a minimal, safe fix.
4. Implement the fix.
5. Add a regression test.

## Avoid

- Random fixes without understanding root cause
- Large rewrites when a targeted fix suffices
- Ignoring related edge cases

## Required Output

- Root cause explanation
- Minimal fix description
- Regression test
- Updated documentation if behavior changed

## Checklist

- [ ] Root cause documented
- [ ] Regression test added
- [ ] Fix is minimal and focused

## Related

- [bug-fixing.md](bug-fixing.md) — Extended debugging workflow
- Composable template: [prompts/templates/fix-bug.md](../../prompts/templates/fix-bug.md)
