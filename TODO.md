# TODO — Security & Code Quality

## Critical 🔴

### ✅ 1. Move JWT tokens out of localStorage
**File:** `apps/web/src/shared/lib/token-storage.ts`

Both access and refresh tokens are stored in plain `localStorage`. Any XSS vulnerability in the app allows an attacker to steal both tokens via `document.cookie` or direct `localStorage` access. The refresh token has a 7-day TTL, meaning a single successful XSS = extended session hijack.

**Fix:** Store the refresh token in an `httpOnly`, `Secure` cookie (inaccessible to JavaScript). Keep the access token in memory only (a module-level variable). On page reload, use the cookie to silently re-issue a new access token via `/auth/refresh`.

---

### 2. Increase minimum password length
**File:** `contracts/src/features/auth/register.ts:6`

`z.string().min(4)` allows passwords like `1234` or `aaaa`. This is far below OWASP/NIST recommendations and makes accounts trivially brute-forceable, especially without rate limiting.

**Fix:** Require at least 12 characters. Optionally add complexity rules (uppercase, number, symbol).

---

## High Priority 🟠

### ✅ 3. Fix race condition in refresh token rotation
**File:** `apps/api/src/features/auth/routes.ts:66-91`

The `exists()` check and `remove()` call are two separate DB operations with no transaction between them. Two concurrent requests with the same refresh token can both pass the `exists()` check before either calls `remove()`, resulting in both receiving valid new token pairs (token reuse attack).

**Fix:** Wrap the check + delete + generate inside a single DB transaction so the operation is atomic.

---

### ✅ 4. Await `deleteExpired()` or handle its error
**File:** `apps/api/src/features/auth/routes.ts:84`

`refreshTokenRepository.deleteExpired()` is called without `await`. If it throws, the error is silently dropped. Expired tokens accumulate in the database over time, and failures go completely unnoticed.

**Fix:**
```typescript
await refreshTokenRepository.deleteExpired().catch(err => {
  console.error('Failed to purge expired tokens:', err)
})
```

---

### 5. Add rate limiting to auth endpoints
**File:** `apps/api/src/features/auth/routes.ts`

`/auth/login`, `/auth/register`, and `/auth/refresh` have no rate limiting. This exposes the app to brute-force password attacks, credential stuffing, and unlimited account creation (denial of service).

**Fix:** Add per-IP rate limiting — e.g. 5 login attempts per 15 minutes, 10 registrations per hour. Elysia has plugins for this, or it can be done at the reverse proxy level (nginx/Caddy).

---

### 6. Fix race condition in optimistic UI updates
**File:** `apps/web/src/feature/workout/useWorkout.ts:32-68`

When an API call fails, `fetchData()` is called but its errors are not handled. Rapid button clicks can also produce multiple in-flight requests that complete out of order, leaving the UI in an inconsistent state.

**Fix:** On failure, replace the optimistic item by its temp ID and handle `fetchData()` errors explicitly. Consider debouncing or disabling the button while a request is in flight.

---

### 7. Validate `year` and `month` query parameters
**File:** `apps/api/src/features/workout/routes.ts:56-65`

The `year` and `month` query params are passed to `new Date(year, month - 1, 1)` without range validation. Sending `month=13` or `year=-1` produces unexpected `Date` values that silently corrupt query results.

**Fix:**
```typescript
year: z.number().int().min(1970).max(2100),
month: z.number().int().min(1).max(12),
```

---

### ✅ 8. Add database indexes on `userId` and compound columns
**File:** `apps/api/src/db/schema/workout-sets.ts`

The `userId` foreign key and the `(userId, exerciseType)` pair have no explicit indexes. Every query filtering by user does a full table scan, which degrades linearly as the `workout_sets` table grows.

**Fix:**
```typescript
export const workoutSets = pgTable(
  'workout_sets',
  { /* existing columns */ },
  (table) => [
    index('idx_workout_sets_user_id').on(table.userId),
    index('idx_workout_sets_user_exercise').on(table.userId, table.exerciseType),
  ],
)
```
Then run `db:generate` + `db:migrate`.

---

### 9. Add request timeouts to fetch calls
**File:** `apps/web/src/shared/lib/fetch-with-refresh.ts`

All `fetch` calls have no timeout. A slow or unresponsive API will hang the UI indefinitely with no way to recover.

**Fix:** Use `AbortController` with a timeout (e.g. 15 seconds):
```typescript
const controller = new AbortController()
const id = setTimeout(() => controller.abort(), 15_000)
try {
  return await fetch(input, { ...init, signal: controller.signal })
} finally {
  clearTimeout(id)
}
```

---

## Medium Priority 🟡

### ✅ 10. Use generic error messages in auth forms
**Files:** `apps/web/src/feature/auth/login/useLogin.ts:14-22`, `apps/web/src/feature/auth/register/useRegister.ts:20`

Raw API error messages are forwarded directly to the user. If the server returns different messages for "user not found" vs "wrong password", attackers can enumerate valid email addresses.

**Fix:** Show a fixed generic message to the user (e.g. `"Invalid email or password"`). Log the actual server error for debugging only.

---

### 11. Validate timezone input
**File:** `contracts/src/features/auth/register.ts:7`

`timezone: z.string().optional()` accepts any string, including invalid values like `"not/real"`. If this value is used in date calculations it will cause runtime errors.

**Fix:** Validate against a list of valid IANA timezone identifiers (e.g. using `Intl.supportedValuesOf('timeZone')` at build time or a static enum).

---

### 12. Replace `console.error` with proper error handling
**File:** `apps/web/src/feature/workout/useWorkout.ts` (5+ locations)

Errors are only logged to the browser console. In production this means failures are invisible unless a user opens DevTools. There's also no user-facing feedback when something goes wrong.

**Fix:** Show an error state in the UI. Consider integrating an error tracking service (Sentry, etc.) for production visibility.

---

## Low Priority 🔵

### 13. Move inline `<style>` block to a CSS file
**File:** `apps/web/src/routes/dashboard/workout.tsx:20-34`

Animation keyframes are defined inline in JSX with a `// TODO` comment. This mixes concerns, can't be reused, and makes the component harder to read.

**Fix:** Move to a `.module.css` file or define the animations using Tailwind's `theme.extend.keyframes`.

---

### 14. Extract hardcoded `'pushups'` exercise type
**File:** `apps/web/src/feature/workout/useWorkout.ts` (5+ locations)

`exerciseType: 'pushups'` is hardcoded in multiple places. Adding a second exercise type will require hunting down every occurrence.

**Fix:** Accept `exerciseType` as a parameter to `useWorkout(exerciseType: ExerciseType)` and pass it from the component.

---

### 15. Extract default goal reps constant
**File:** `apps/api/src/features/workout/service.ts:46` (3+ locations)

`?? 100` appears in multiple places as the fallback goal. If the default ever changes, it needs to be updated everywhere.

**Fix:**
```typescript
const DEFAULT_GOAL_REPS = 100
```

---

### 16. Replace magic number in date string slicing
**File:** `apps/web/src/feature/workout/useWorkoutProgress.ts:37`

`date.slice(8, 10)` extracts the day from a `YYYY-MM-DD` string using a magic index with no comment explaining it.

**Fix:**
```typescript
const day = String(parseInt(date.split('-')[2], 10)) // YYYY-MM-DD → day without leading zero
```

---

### 17. Add error boundary around dashboard `beforeLoad`
**File:** `apps/web/src/routes/dashboard.tsx`

If `api.auth.me.get()` throws an unexpected error (network failure, malformed response), it crashes the entire dashboard with no recovery path. Currently only `error` from the response is handled, not thrown exceptions.

**Fix:** Wrap the `beforeLoad` body in a `try/catch` and redirect to login on any failure.
