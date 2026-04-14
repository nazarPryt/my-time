---
name: auth feature tests
description: Location and coverage summary for the auth feature test file
type: project
---

File: `apps/api/src/features/auth/auth.test.ts`

Covered routes:
- POST /auth/register — happy path, duplicate email (409), invalid body (422)
- POST /auth/login — valid credentials, wrong password (401), unknown email (401)
- POST /auth/refresh — rotates token, single-use enforcement, missing cookie (401)
- POST /auth/logout — invalidates refresh token
- GET /auth/me — returns user, no token (401), invalid token (401)

Helper: `getRefreshCookie(response)` extracts the `refreshToken` cookie value from `Set-Cookie` header.
