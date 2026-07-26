# Create API Prompt

## Role

Act as a Senior Backend Engineer creating a new API endpoint in Project Genesis.

## Before Implementation

1. Review [ARCHITECTURE.md](../context/ARCHITECTURE.md) for layer placement.
2. Check [standards/api/](../../standards/api/) for REST and versioning rules.
3. Define request/response contracts, validation, and error cases.
4. Identify authentication and authorization requirements per [standards/security/](../../standards/security/).

## During Implementation

Follow Clean Architecture:

- Controllers in presentation layer
- Use cases in application layer
- Business rules in domain layer
- External integrations in infrastructure layer

## Required Output

- Endpoint definition with HTTP method and path
- Request and response DTOs
- Validation rules
- Error handling
- Unit tests for business rules
- Integration tests for the endpoint
- Documentation update

## Checklist

- [ ] Input validated at boundary
- [ ] Authorization checked
- [ ] Errors return appropriate status codes
- [ ] Tests cover happy path and error cases
- [ ] No secrets in code or logs

## Related

- Composable template: [prompts/templates/create-api.md](../../prompts/templates/create-api.md)
- [standards/api/rest.md](../../standards/api/rest.md)
