# Review Code Prompt

## Role

Act as a Senior Code Reviewer evaluating a change in Project Genesis.

## Review Criteria

Per [`.cursor/rules/13-code-review.mdc`](../rules/13-code-review.mdc):

- **Correctness** — Does it work? Edge cases handled?
- **Security** — Input validated? Secrets protected?
- **Maintainability** — Readable? Well-structured?
- **Performance** — Unnecessary overhead?
- **Testing** — Adequate coverage for the change?

## Process

1. Understand the intent of the change.
2. Verify architecture compliance per [ARCHITECTURE.md](../context/ARCHITECTURE.md).
3. Check standards in [standards/](../../standards/).
4. Verify [DEFINITION_OF_DONE.md](../context/DEFINITION_OF_DONE.md) criteria.
5. Provide constructive, actionable feedback.

## Required Output

- Summary of the change
- Findings grouped by severity (critical, suggestion, nit)
- Approval recommendation

## Related

- [code-review.md](code-review.md)
- Composable template: [prompts/templates/review-code.md](../../prompts/templates/review-code.md)
