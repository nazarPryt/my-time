import { useEffect } from 'react'
import { useTimeTrackerStore } from './store'

/** Reconcile sessions changed by the desktop or another browser without reloading. */
export function useTimeTrackerSync(): void {
	const load = useTimeTrackerStore((state) => state.load)
	const pauseTicking = useTimeTrackerStore((state) => state.pauseTicking)
	useEffect(() => {
		const controller = new AbortController()
		let refreshing = false
		const refresh = async () => {
			if (
				refreshing ||
				controller.signal.aborted ||
				document.visibilityState === 'hidden'
			)
				return
			refreshing = true
			try {
				await load(controller.signal)
			} finally {
				refreshing = false
			}
		}
		void refresh()
		const interval = setInterval(() => {
			void refresh()
		}, 5000)
		const onFocus = () => {
			void refresh()
		}
		window.addEventListener('focus', onFocus)
		document.addEventListener('visibilitychange', onFocus)
		return () => {
			controller.abort()
			clearInterval(interval)
			window.removeEventListener('focus', onFocus)
			document.removeEventListener('visibilitychange', onFocus)
			pauseTicking()
		}
	}, [load, pauseTicking])
}
