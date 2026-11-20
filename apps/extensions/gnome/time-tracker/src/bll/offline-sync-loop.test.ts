import { expect, mock, test } from 'bun:test'
import { OfflineSyncLoop } from './offline-sync-loop'

test('queued writes retry with backoff, stop after acknowledgement, and never poll idle state', async () => {
	let pending = false
	let resume!: () => void
	const retry = {
		wait: mock(
			() =>
				new Promise<void>((done) => {
					resume = done
				}),
		),
		dispose: mock(() => resume?.()),
	}
	const flush = mock(async () => {
		if (flush.mock.calls.length > 1) pending = false
	})
	const loop = new OfflineSyncLoop(retry, () => pending, flush)
	loop.wake()
	expect(flush).not.toHaveBeenCalled()
	pending = true
	loop.wake()
	loop.wake()
	await Promise.resolve()
	await Promise.resolve()
	expect(flush).toHaveBeenCalledTimes(1)
	expect(retry.wait.mock.calls[0]?.[0]).toBeGreaterThanOrEqual(750)
	resume()
	await Promise.resolve()
	await Promise.resolve()
	await Promise.resolve()
	expect(flush).toHaveBeenCalledTimes(2)
	loop.wake()
	expect(flush).toHaveBeenCalledTimes(2)
	loop.dispose()
})

test('disposing a waiting retry prevents subsequent uploads', async () => {
	let resume!: () => void
	const flush = mock(async () => {})
	const loop = new OfflineSyncLoop(
		{
			wait: () =>
				new Promise<void>((done) => {
					resume = done
				}),
			dispose: () => resume?.(),
		},
		() => true,
		flush,
	)
	loop.wake()
	await Promise.resolve()
	await Promise.resolve()
	loop.dispose()
	await Promise.resolve()
	await Promise.resolve()
	expect(flush).toHaveBeenCalledTimes(1)
})
