---
name: Auth token pattern in tests
description: How to obtain a real JWT access token for authenticated route tests — no manual jwt.sign needed
type: project
---

Never call `jwt.sign` directly in tests. Instead, register a user via the treaty client and extract the `accessToken` from the response. This produces a valid JWT signed with the real app secret.

```ts
async function registerAndGetToken(user: typeof VALID_USER) {
  const { data } = await client.auth.register.post(user)
  if (!data) throw new Error('Registration failed')
  return {
    token: data.tokens.accessToken,
    userId: data.user.id,
  }
}

function authHeaders(token: string) {
  return { authorization: `Bearer ${token}` }
}
```

Use `authHeaders(token)` as the `headers` object on every authenticated request.

**Why:** Using register/login ensures the test token goes through the real JWT signing path and the user actually exists in the DB. Manual signing could diverge from app behaviour.
**How to apply:** Use in every test file that needs authenticated routes.
