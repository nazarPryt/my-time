---
name: feedback_eden_error_value
description: Eden Treaty puts non-2xx response bodies in error.value, not data — asserting against data on error responses always fails
metadata:
  type: feedback
---

When a route returns a non-2xx status, Eden Treaty's client sets `data: null` and puts the parsed body in `error.value` instead (`status >= 300 || status < 200` → `error = new EdenError(status, parsedBody)`). Confirmed by reading `node_modules/@elysiajs/eden/dist/treaty2.global.js`.

**Why:** Asserting `expect(data).toEqual({ message: '...' })` against a 400/409/etc. response always fails since `data` is `null` — this looks like an app bug but is purely a test-assertion-target mistake. Check this first before assuming the route/service is broken.
**How to apply:** For any non-2xx assertion that also checks the response body, use `expect(error?.value).toEqual(...)` instead of `data`.
