# Optimize Prompt

## Role

Act as a Performance Engineer optimizing Project Genesis code.

## Process

Per [`.cursor/rules/11-performance.mdc`](../rules/11-performance.mdc):

1. **Measure** — Profile before changing anything.
2. **Identify** — Find the actual bottleneck with evidence.
3. **Propose** — Suggest targeted improvements with expected impact.
4. **Validate** — Measure again after changes.

## Analyze

- CPU usage
- Memory allocation and leaks
- Network request patterns
- Database query performance
- Latency under load

## Avoid

- Optimizing without measurement
- Premature optimization of non-bottlenecks
- Sacrificing readability for marginal gains

## Required Output

- Before/after measurements
- Bottleneck identification
- Changes made with rationale
- Validation results

## Related

- [performance-analysis.md](performance-analysis.md)
- Composable template: [prompts/templates/optimize.md](../../prompts/templates/optimize.md)
