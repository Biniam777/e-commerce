# E-commerce Project Rules

## Project stack

- Frontend: React with Vite (to be added later)
- Backend: Node.js with Express
- Language: JavaScript
- Database: MySQL
- ORM: Prisma
- Authentication: JWT with bcrypt/bcryptjs
- API style: REST
- Package manager: npm
- Development environment: WSL Ubuntu

## Architecture

- `backend/src/app.js` creates and configures the Express application.
- `backend/src/server.js` loads environment configuration and starts the HTTP server.
- Controllers handle HTTP concerns only.
- Services contain business logic.
- Prisma is the only database access layer.
- Routes define endpoints and middleware composition.
- Middleware handles authentication, authorization, errors, and other cross-cutting concerns.
- Validators handle external input validation.
- Utilities contain genuinely reusable helper functions.
- Keep abstractions small and conventional; do not create layers without a current use.

## Database rules

- Use MySQL through Prisma only.
- Do not access the database with raw drivers from application code.
- Keep Prisma schema and migrations in `backend/prisma/`.
- Never commit real credentials or secrets.
- Review migration changes before applying them.

## Authentication and security rules

- Use JWT for authentication and bcrypt/bcryptjs for password hashing.
- Store secrets and connection strings in environment variables.
- Never log passwords, tokens, secrets, or other sensitive credentials.
- Validate authentication and authorization at the middleware boundary.
- Apply least-privilege access and secure defaults.

## API conventions

- Build REST endpoints with conventional HTTP methods and status codes.
- Keep response shapes consistent within a resource.
- Keep controllers thin and delegate business decisions to services.
- Do not add feature endpoints until the related feature is explicitly requested.

## Error-handling conventions

- Use centralized Express error handling.
- Return safe, useful error responses without exposing stack traces or secrets in production.
- Use appropriate HTTP status codes and stable error messages.
- Handle expected operational errors explicitly; let unexpected errors reach the central handler.

## Validation rules

- Validate all external input at the API boundary before business logic or database access.
- Reject malformed, unexpected, and unsafe input.
- Keep validation schemas close to their route/controller boundary.
- Do not rely on client-side validation for security.

## Git and commit expectations

- Use focused commits with clear, imperative messages.
- Do not commit `.env` files, secrets, dependencies, generated logs, or local editor files.
- Review the diff and run relevant checks before committing.
- Do not rewrite history or commit on behalf of the user unless explicitly requested.

## Technology restrictions

- Do not introduce MongoDB, PostgreSQL, Sequelize, TypeORM, Firebase, Next.js, Supabase, GraphQL, or other unapproved databases, ORMs, frameworks, or API styles.
- Ask for explicit approval before adding a technology outside the project stack.

## Change discipline

- Keep work limited to the requested feature or foundation.
- Existing working code must not be rewritten unnecessarily.
- Prefer the smallest change that solves the current problem and preserve established conventions.