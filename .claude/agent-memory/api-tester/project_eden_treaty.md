---
name: Eden Treaty test client pattern
description: How to build the typed test client and call routes including path-parameter routes
type: project
---

All API tests use the Eden Treaty client from `@elysiajs/eden`:

```ts
import { treaty } from '@elysiajs/eden'
import { app } from '@/app'

const client = treaty(app).api.v1
```

Routes are called as properties matching the path segments. Hyphens in path names use bracket notation:

```ts
// GET /api/v1/time-tracker/active
client['time-tracker'].active.get({ headers: { ... } })

// POST /api/v1/time-tracker/start
client['time-tracker'].start.post({ type: 'work' }, { headers: { ... } })

// PATCH /api/v1/time-tracker/:id/end  (path parameter)
client['time-tracker']({ id: session.id }).end.patch(undefined, { headers: { ... } })

// DELETE /api/v1/time-tracker/:id
client['time-tracker']({ id: session.id }).delete({ headers: { ... } })
```

**Why:** treaty(app) gives end-to-end TypeScript type safety and matches the web client's pattern.
**How to apply:** Always prefer treaty over raw `app.handle(new Request(...))` in this project.
