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
