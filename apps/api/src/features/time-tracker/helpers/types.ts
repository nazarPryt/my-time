import type { DailySummary, SessionResponse } from '@my-time/contracts'

// contracts' SessionResponse minus `id` — these aggregation helpers only
// group/compute over session fields and never need the id.
export type SessionLike = Omit<SessionResponse, 'id'>

// contracts' DailySummary minus `date` — the running per-day totals before a
// date is attached to them (see buildDayRange).
export type DayStats = Omit<DailySummary, 'date'>
