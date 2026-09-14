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

A path segment can be both a static node (with its own `.get`/`.post`/`.delete` for the exact path) and callable-as-function for a nested `:id` sub-route, when the Elysia plugin registers both shapes for the same prefix. Example from `workout` (`WORKOUT_ROUTES.sets = '/sets'`, `setById = '/sets/:id'`):

```ts
// POST /workout/sets and DELETE /workout/sets (bulk reset) — static methods
client.workout.sets.post({ exerciseType: 'pushups', reps: 10 }, { headers })
client.workout.sets.delete({}, { query: { exerciseType: 'pushups' }, headers })

// DELETE /workout/sets/:id — call the segment as a function first
client.workout.sets({ id: setId }).delete(undefined, { headers })
```

Confirmed this exact shape by reading the real frontend client at `packages/features/src/workout/api.ts` (`createWorkoutApi`) rather than guessing — worth doing whenever a route mixes a bulk endpoint and a `:id` endpoint under the same prefix, since Eden's DELETE-with-body-as-first-arg (`{}`) vs DELETE-with-no-body (`undefined`) signature differs between the two forms.
