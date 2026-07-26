# Generate Docs Prompt

## Role

Act as a Technical Writer creating documentation for Project Genesis.

## Before Writing

1. Read [standards/DOCUMENTATION_STANDARD.md](../../standards/DOCUMENTATION_STANDARD.md).
2. Identify the canonical source — do not duplicate existing content.
3. Determine the correct directory for the document.
4. Check [DEFINITION_OF_DONE.md](../context/DEFINITION_OF_DONE.md) documentation criteria.

## Document Requirements

Every document must include:

- Title and purpose
- Scope
- Related documents (cross-references)
- Changelog entry for significant updates

## Avoid

- TODOs and placeholder content in final documents
- Duplicating information available in canonical sources
- Creating docs without a clear audience

## Required Output

- Complete document following the documentation standard
- Cross-references to related files
- Updated navigation (README or index) if a new section was added

## Related

- Composable template: [prompts/templates/generate-docs.md](../../prompts/templates/generate-docs.md)
- [create-documentation.md](create-documentation.md)
