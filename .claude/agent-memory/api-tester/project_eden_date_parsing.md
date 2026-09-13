---
name: Eden Treaty auto-parses date-looking strings into Date objects
description: Gotcha where treaty() response JSON parsing converts ISO date strings to Date instances, breaking z.string() contract schemas on non-null values
type: project
---

`@elysiajs/eden`'s `treaty()` client parses JSON responses with a custom reviver that auto-converts any ISO-8601-looking string value into a native `Date` instance, unless the client is constructed with `parseDate: false`. This happens client-side only — the real wire format is always a plain JSON string; Eden's reviver is a convenience.

This silently breaks Zod contract schemas that declare a date field as `z.string()` (as the permesso contracts do: `lastCheckedAt`, `checkedAt`) the moment a test actually receives a **non-null** populated date value — `SomeResponseSchema.parse(data)` throws `ZodError: expected string, received Date`. It went unnoticed for a long time in `permesso.test.ts` because every pre-existing test only ever saw those fields as `null` (which passes through unaffected) — first surfaced when adding `POST /permesso/check` and `GET /permesso/history` tests that assert a real populated `checkedAt`.

Contrast with `contracts/src/features/time-tracker/session.ts`, which uses `z.coerce.date()` for `startedAt`/`endedAt` — that schema tolerates *either* a string or an already-parsed `Date`, so time-tracker tests never hit this.

**Fix applied (test-side only, no contract/production change):** construct the Eden client for a test file with the option disabled:
```ts
const api = treaty(app, { parseDate: false }).api.v1
```
This makes the client see the true wire format (always a JSON string), matching what a `z.string()`-typed contract schema expects. Confirmed this doesn't affect any other test in `permesso.test.ts` (schedule/reset tests only ever assert `null` dates).

**Why:** Preferred over loosening the contract schemas to `z.coerce.date()`, since that's a production/contract-shape decision outside the scope of writing tests — flag it to the user rather than silently changing `contracts/`.
**How to apply:** If a future feature's tests need to assert a real (non-null) date field returned through Eden Treaty against a `z.string()`-typed contract schema, pass `{ parseDate: false }` to that test file's `treaty()` call. If a schema already uses `z.coerce.date()`, this isn't needed.

See also [[project_mock_module_pattern]].
