import { useEffect } from 'react'
import { startTimeTrackerSync } from './session-sync'
import { useTimeTrackerStore } from './store'

export function useTimeTrackerSync(): void {
	useEffect(() => startTimeTrackerSync(useTimeTrackerStore.getState()), [])
}
