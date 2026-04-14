---
name: DB seeding pattern for tests
description: How to insert test fixtures directly into the DB using Drizzle for state that cannot be created through the API
type: project
---

Import `db` and table schemas directly for seeding rows that would be inconvenient to create through the public API (e.g., sessions with specific timestamps, abandoned sessions, sessions from past days).

```ts
import { db } from '@db'
import { timeSessions } from '@db/schema'

// Completed session
const [session] = await db
  .insert(timeSessions)
  .values({ userId, type: 'work', startedAt, endedAt })
  .returning()

// Abandoned session
await db.insert(timeSessions).values({
  userId,
  type: 'work',
  startedAt: subMinutes(now, 60),
  abandonedAt: subMinutes(now, 30),
})
```

Always use `date-fns` helpers (`subMinutes`, `subHours`, `subDays`, etc.) for timestamp arithmetic — never raw `Date` arithmetic.

**Why:** Some edge cases (stale session auto-abandon, streak calculation) require sessions with precise past timestamps that the `/start` endpoint cannot produce.
**How to apply:** Use direct DB inserts for fixture setup; the API layer for happy-path flows.
