# Refactoring TODO — Three-Layer Architecture

## Goal

Enforce UI → BLL → DAL separation across the entire `apps/web` frontend.
- **DAL** (`api.ts`): Eden Treaty calls only. No state, no logic.
- **BLL** (`store.ts` or hook): Zustand store (or form hook). Calls DAL only, never `api` directly.
- **UI** (`ui/*.tsx`): React components. Calls BLL only, never `api` directly.

---

## Violations Found

### 1. `feature/auth/login/useLogin.ts`
**Problem:** BLL hook imports and calls `api.auth.login.post()` directly. No DAL layer exists.

**Plan:**
- Create `feature/auth/login/api.ts` (DAL) — move the `api.auth.login.post()` call there.
- Update `useLogin.ts` (BLL) — import the DAL function instead of `api`.

**Note:** `useLogin` is form-driven (react-hook-form), so it stays as a hook, not a Zustand store. That is acceptable for auth forms since there is no persistent shared state.

---

### 2. `feature/auth/register/useRegister.ts`
**Problem:** Same as login — BLL calls `api.auth.register.post()` directly. No DAL layer.

**Plan:**
- Create `feature/auth/register/api.ts` (DAL) — move the `api.auth.register.post()` call there.
- Update `useRegister.ts` (BLL) — import the DAL function instead.

---

### 3. `feature/auth/logout/useLogout.ts`
**Problem:** BLL calls `api.auth.logout.post()` directly. No DAL layer.

**Plan:**
- Create `feature/auth/logout/api.ts` (DAL) — move the `api.auth.logout.post()` call there.
- Update `useLogout.ts` (BLL) — import the DAL function instead.

---

### 4. `feature/workout/useWorkout.ts`
**Problem:** BLL hook calls 5 different `api.workout.*` endpoints directly. No DAL layer. No Zustand store — uses raw `useState`/`useCallback` instead.

**Plan:**
- Create `feature/workout/api.ts` (DAL) — extract all 5 `api.workout.*` calls (`today.get`, `sets.post`, `sets({ id }).delete`, `sets.delete`, `goal.put`).
- Replace `useWorkout.ts` with `feature/workout/store.ts` (BLL) — Zustand store that calls DAL functions. State shape stays the same (`data`, `loading`, `error`, `submitting`).
- Update all UI components under `feature/workout/ui/` that currently consume `useWorkout` to use `useWorkoutStore` instead.
- Remove `useWorkout.ts`.

**Contracts check:** `TodayResponse`, `SetResponse`, `ExerciseType` are already imported from `contracts` — keep them. No local type duplication here.

---

### 5. `feature/workout/useWorkoutProgress.ts`
**Problem:** BLL hook calls `api.workout.progress.get()` directly. No DAL layer. No Zustand store. Has a locally defined `ChartEntry` type — verify if a matching type exists in `contracts` and remove the local one if so.

**Plan:**
- Create or extend `feature/workout/api.ts` (DAL) — add `fetchWorkoutProgress(exerciseType, year, month)`.
- Replace `useWorkoutProgress.ts` with a slice in `feature/workout/store.ts` or a separate `feature/workout/progressStore.ts` (BLL) — Zustand store with `data`, `loading`, `goalReps`, `cursor` state and `prevMonth`/`nextMonth` actions.
- Check `contracts` for a progress response type before keeping the local `ChartEntry` type.
- Remove `useWorkoutProgress.ts`.

---

### 6. `feature/time-tracker/useTimeProgress.ts`
**Problem:** BLL hook calls `api['time-tracker'].weekly.get()` directly. No DAL layer. No Zustand store. Has a locally defined `TimeChartEntry` type — verify if contracts exports a matching type.

**Plan:**
- Create `feature/time-tracker/api.ts` (DAL) — add `fetchWeeklyProgress()`.
- Replace `useTimeProgress.ts` with `feature/time-tracker/store.ts` (BLL) — Zustand store with `data` and `loading` state.
- Check `contracts` for a weekly response type before keeping the local `TimeChartEntry` type.
- Remove `useTimeProgress.ts`.

---

### 7. `routes/dashboard/time-tracker.tsx` ← biggest violation
**Problem:** The route file is doing everything: direct `api['time-tracker'].*` calls, all state management (`useState`, `useCallback`, `useRef`), business logic (optimistic-style fetches, timer tick interval), AND rendering. All three layers are collapsed into one 319-line file. Helper components (`SessionRow`, `StatCard`) are also defined inline.

**Plan:**
- Create `feature/time-tracker/api.ts` (DAL) — extract all `api['time-tracker'].*` calls: `active.get`, `today.get`, `start.post`, `({ id }).end.patch`, `({ id }).delete`.
- Create `feature/time-tracker/store.ts` (BLL) — Zustand store with `activeSession`, `todaySummary`, `loading`, `submitting` state and `load`, `startWork`, `stopWork`, `deleteSession` actions. Move the interval tick logic into the store (or a dedicated hook that wraps the store).
- Create UI components under `feature/time-tracker/ui/`:
  - `TimeTrackerWidget.tsx` — the main card with the ring timer and controls.
  - `SessionRow.tsx` — existing inline component, extract as-is.
  - `TodayStats.tsx` — the three stat cards grid.
  - `SessionList.tsx` — the sessions list.
- Slim down `routes/dashboard/time-tracker.tsx` to just the route definition + importing the feature UI.
- The `formatElapsed` and `formatDuration` helpers should live in `feature/time-tracker/` (or `shared/lib/`) not in the route file.
- Use `contracts` types (`SessionResponse`, `TodaySummaryResponse`) in the store state — they are already imported in the route, just move them to the right layer.

---

### 8. `routes/dashboard.tsx` — `beforeLoad` auth guard
**Problem:** Route `beforeLoad` calls `api.auth.me.get()` directly in a route file.

**Plan:**
- Create `feature/auth/api.ts` (shared auth DAL) — add `fetchMe()`.
- Update `dashboard.tsx` `beforeLoad` to call `fetchMe()` instead.

**Note:** This is a lower priority since `beforeLoad` is a framework-level concern and the call is intentionally one-off.

---

## Suggested Refactoring Order

1. Auth DAL extractions (login, register, logout, me) — small and self-contained, good warmup.
2. Workout feature — `useWorkout` → `store.ts` + `api.ts`, then `useWorkoutProgress`.
3. Time-tracker feature — biggest change, tackle last. Start with `api.ts` + `store.ts`, then extract UI components, then slim down the route.