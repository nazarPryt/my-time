# Mobile Workout Tab — Design Spec

**Date:** 2026-04-22
**Scope:** Add a Workout tab to the React Native / Expo mobile app that mirrors the web workout screen, using the shared `packages/features` store.

---

## Goal

Add a "Workout" tab to the mobile app's protected tab navigator. The tab shows today's push-up stats and lets the user log, view, and delete sets — identical functionality to the web, adapted for touch.

**Out of scope for this iteration:** goal editing, monthly progress chart.

---

## Architecture

The shared `packages/features` workout store is already wired at `apps/mobile/feature/workout/index.ts`, which exports `useWorkoutStore`. The screen imports this hook directly — no new business logic needed. The screen is a pure UI layer.

```
app/(protected)/workout.tsx        — route file (new)
feature/workout/
  index.ts                         — already exists (store wiring)
  ui/
    WorkoutScreen.tsx              — main scrollable container (new)
    HeroCard.tsx                   — counter + progress bar (new)
    QuickAddButtons.tsx            — 4-button row (new)
    SetsLog.tsx                    — sets list with delete + reset (new)
```

---

## Screen Layout

Single `ScrollView` with all sections stacked vertically, matching the web one-column layout.

### Header
Inline within the screen (not a native navigation header). Shows a dumbbell emoji, "Workout" title, and today's date on the right (formatted with `date-fns`: `"Tue, Apr 22"`).

### HeroCard
Dark card (`#1e293b` background, 16px border radius). Contains:
- "PUSH-UPS TODAY" uppercase label (muted, small)
- Large bold rep counter — font size 72, color `#f1f5f9`
- Indigo progress bar: width = `(total / goal.targetReps) * 100`%, clamped 0–100
- Two labels below bar: `"{N} left"` on the left, `"@ {goal}"` on the right (read-only)

### QuickAddButtons
Four `Pressable` buttons in a single `flexDirection: 'row'` row with `flex: 1` each and 8px gaps. Each shows a small "+" label above a large bold number (5, 10, 15, 20). Tap calls `addSet(reps)`. Buttons disabled while `submitting === true`.

### SetsLog
Dark card with:
- **Header row:** "SETS · {N}" label (uppercase, muted) + "↺ Reset day" button (red text). Tapping "Reset day" shows `Alert.alert` with "Reset day?" confirmation. On confirm, calls `resetDay()`.
- **Set rows:** one row per set, newest first (reversed). Each row: time on left (`HH:mm` via `date-fns`), reps on right in indigo (`+{N}`), trash icon far right. Tapping trash shows `Alert.alert` with "Delete set?" confirmation. On confirm, calls `deleteSet(id)`.
- **Empty state:** when `data.sets` is empty, centered flame emoji + "No sets yet. Start pushing." in muted text.
- **Loading state:** centered `ActivityIndicator` while `loading === true`.

---

## Navigation

Add a `<Tabs.Screen name="workout">` entry to `app/(protected)/_layout.tsx`. Tab icon: dumbbell emoji or a simple barbell SVG (use emoji for now). Tab label: "Workout". Active color: `#6366f1` (indigo-500), matching the existing tab bar theme.

---

## Data Flow

```
useWorkoutStore()
  ├── load(signal)        — called in useEffect on mount
  ├── data                — TodayResponse | null
  ├── loading             — shows ActivityIndicator
  ├── submitting          — disables quick-add buttons
  ├── addSet(reps)        — called by QuickAddButtons
  ├── deleteSet(id)       — called after Alert confirmation
  └── resetDay()          — called after Alert confirmation
```

Abort signal passed to `load()` to cancel in-flight requests on unmount.

---

## Interactions

| Action | Trigger | Behaviour |
|---|---|---|
| Add set | Tap quick-add button | Optimistic update, button row disabled during submit |
| Delete set | Tap trash → confirm alert | Optimistic removal, restored on error |
| Reset day | Tap "Reset day" → confirm alert | Clears all sets, reloads |
| Pull to refresh | Not included (use mount load) | — |

---

## Styling

Follows the existing mobile dark theme already established in the app:
- Background: `#0f172a` (slate-900)
- Card background: `#1e293b` (slate-800)
- Border / divider: `#334155` (slate-700)
- Text primary: `#f1f5f9`
- Text muted: `#64748b`
- Accent: `#6366f1` (indigo-500)

No new third-party UI libraries. Uses React Native core primitives: `View`, `Text`, `Pressable`, `ScrollView`, `ActivityIndicator`, `Alert`.

---

## Files to Create / Modify

| Action | Path |
|---|---|
| Create | `apps/mobile/app/(protected)/workout.tsx` |
| Create | `apps/mobile/feature/workout/ui/WorkoutScreen.tsx` |
| Create | `apps/mobile/feature/workout/ui/HeroCard.tsx` |
| Create | `apps/mobile/feature/workout/ui/QuickAddButtons.tsx` |
| Create | `apps/mobile/feature/workout/ui/SetsLog.tsx` |
| Modify | `apps/mobile/app/(protected)/_layout.tsx` |
