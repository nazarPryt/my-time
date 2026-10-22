import { useTimeTrackerStore } from './store'

export function useDesktopStatus() {
	return useTimeTrackerStore((state) => state.desktopStatus)
}
