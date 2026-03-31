import type { SessionType } from 'contracts'
import { api } from '@/shared/lib/api'

export async function fetchActiveSession() {
	return api['time-tracker'].active.get()
}

export async function fetchTodaySummary(signal?: AbortSignal) {
	return api['time-tracker'].today.get({ fetch: { signal } })
}

export async function startSession(type: SessionType) {
	return api['time-tracker'].start.post({ type })
}

export async function endSession(id: string) {
	return api['time-tracker']({ id }).end.patch()
}

export async function deleteSession(id: string) {
	return api['time-tracker']({ id }).delete()
}

export async function fetchWeeklyProgress(signal?: AbortSignal) {
	return api['time-tracker'].weekly.get({ fetch: { signal } })
}
