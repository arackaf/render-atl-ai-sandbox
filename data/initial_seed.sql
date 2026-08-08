TRUNCATE issues, epics RESTART IDENTITY CASCADE;

INSERT INTO epics (name, description) VALUES
  ('Authentication System', 'Implement user authentication and authorization using JWT tokens and role-based access control.'),
  ('CI/CD Pipeline', 'Set up continuous integration and deployment pipelines with automated testing and staging environments.'),
  ('API Rate Limiting', 'Design and implement rate limiting across all public API endpoints to prevent abuse.');

-- Epic 1: Authentication System (epic_id = 1)
INSERT INTO issues (title, description, status, epic_id) VALUES
  ('Set up JWT token validation middleware', 'Create Express middleware that validates JWT tokens on protected routes and attaches the decoded user to the request object.', 'done', 1),
  ('Implement refresh token rotation', 'Add refresh token support with automatic rotation to prevent token reuse attacks.', 'done', 1),
  ('Add role-based access control', 'Implement RBAC with admin, editor, and viewer roles. Gate API endpoints based on the authenticated user''s role.', 'todo', 1),
  ('Create login and registration endpoints', 'Build POST /auth/login and POST /auth/register with input validation, password hashing, and proper error responses.', 'done', 1),
  ('Write integration tests for auth flows', 'Cover login, registration, token refresh, and role checks with integration tests against a test database.', 'todo', 1),
  ('Add password reset flow', 'Implement forgot-password and reset-password endpoints with time-limited email tokens.', 'todo', 1);

-- Epic 2: CI/CD Pipeline (epic_id = 2)
INSERT INTO issues (title, description, status, epic_id) VALUES
  ('Configure GitHub Actions workflow', 'Set up a GitHub Actions workflow that runs lint, type-check, and tests on every pull request.', 'done', 2),
  ('Add Docker build step to pipeline', 'Create a multi-stage Dockerfile and add a build step that produces a production image on merge to main.', 'done', 2),
  ('Set up staging environment auto-deploy', 'Automatically deploy the Docker image to the staging environment when the main branch passes all checks.', 'todo', 2),
  ('Add database migration step', 'Run pending database migrations as part of the deploy pipeline before the new container starts.', 'todo', 2),
  ('Integrate code coverage reporting', 'Upload coverage reports to Codecov and add a PR status check that fails below 80% coverage.', 'done', 2);

-- Epic 3: API Rate Limiting (epic_id = 3)
INSERT INTO issues (title, description, status, epic_id) VALUES
  ('Research rate limiting strategies', 'Compare token bucket, sliding window, and fixed window algorithms. Write a short ADR with the recommended approach.', 'done', 3),
  ('Implement sliding window rate limiter', 'Build a Redis-backed sliding window rate limiter that tracks requests per API key.', 'todo', 3),
  ('Add rate limit headers to responses', 'Include X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers on every API response.', 'todo', 3),
  ('Create rate limit dashboard', 'Build an internal dashboard showing per-key request counts, throttle events, and top consumers.', 'todo', 3),
  ('Write load tests for rate limiter', 'Use k6 to simulate burst traffic and verify the limiter correctly throttles above the configured threshold.', 'todo', 3),
  ('Add per-endpoint rate limit overrides', 'Allow different rate limits per endpoint via configuration so expensive operations can have tighter limits.', 'done', 3);

-- Issues with no epic
INSERT INTO issues (title, description, status) VALUES
  ('Fix N+1 query in project listing endpoint', 'The GET /projects endpoint fires a separate query for each project''s issue count. Refactor to use a single aggregating query.', 'todo'),
  ('Upgrade Node.js from 18 to 20 LTS', 'Update the base Docker image and CI config to Node 20. Run the full test suite and fix any breakages.', 'done'),
  ('Add structured JSON logging', 'Replace console.log calls with a structured logger (pino) that outputs JSON in production and pretty-prints in development.', 'todo'),
  ('Document API endpoints in OpenAPI spec', 'Write an OpenAPI 3.1 spec covering all public endpoints, request/response schemas, and error codes.', 'done');
