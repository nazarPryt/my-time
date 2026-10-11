import { addDays, differenceInMilliseconds, startOfDay } from 'date-fns'

export function waitForRetry(
	milliseconds: number,
	signal: AbortSignal,
): Promise<void> {
	return new Promise((resolve) => {
		function finish(): void {
			clearTimeout(timer)
			signal.removeEventListener('abort', finish)
			resolve()
		}
		const timer = setTimeout(finish, milliseconds)
		signal.addEventListener('abort', finish, { once: true })
		if (signal.aborted) finish()
	})
}

export function scheduleMidnight(onMidnight: () => void): () => void {
	let timer: ReturnType<typeof setTimeout>
	function schedule(): void {
		const now = new Date()
		const nextMidnight = startOfDay(addDays(now, 1))
		timer = setTimeout(
			() => {
				onMidnight()
				schedule()
			},
			differenceInMilliseconds(nextMidnight, now),
		)
	}
	schedule()
	return () => clearTimeout(timer)
}

export function observeSessionResume(onResume: () => void): () => void {
	function onVisible(): void {
		if (document.visibilityState === 'visible') onResume()
	}
	window.addEventListener('online', onResume)
	document.addEventListener('visibilitychange', onVisible)
	return () => {
		window.removeEventListener('online', onResume)
		document.removeEventListener('visibilitychange', onVisible)
	}
}
