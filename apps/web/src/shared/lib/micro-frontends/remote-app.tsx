import type {
	MountedRemote,
	RemoteBaseProps,
	RemoteModule,
} from '@my-time/micro-frontends'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

type RemoteStatus =
	| { kind: 'loading' }
	| { kind: 'ready'; module: RemoteModule<unknown> }
	| { kind: 'error'; error: Error }

interface RemoteAppProps<Props extends RemoteBaseProps> {
	/** Loads the remote module (see loadRemoteModule). */
	load: () => Promise<RemoteModule<Props>>
	/** Props passed through to the remote's mount/update. */
	props: Props
	/** Rendered while the remote's code is downloading. */
	fallback: ReactNode
	/** Rendered when loading, mounting or the remote itself fails. */
	renderError: (error: Error, retry: () => void) => ReactNode
	className?: string
	testId?: string
}

/**
 * Generic React adapter for any framework-agnostic remote: loads it, mounts it
 * into a DOM node React doesn't touch, forwards prop changes, and unmounts it
 * when the route changes. A remote failure only replaces this box with the
 * error UI — the rest of the dashboard keeps working.
 */
export function RemoteApp<Props extends RemoteBaseProps>({
	load,
	props,
	fallback,
	renderError,
	className,
	testId,
}: RemoteAppProps<Props>) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mountedRef = useRef<MountedRemote<Props> | null>(null)
	const [status, setStatus] = useState<RemoteStatus>({ kind: 'loading' })
	const [attempt, setAttempt] = useState(0)

	// Latest props for mount() and for the error callback, without making
	// every prop change remount the remote.
	const propsRef = useRef(props)
	propsRef.current = props

	const fail = useCallback((error: Error) => {
		console.error('[micro-frontend]', error)
		setStatus({ kind: 'error', error })
	}, [])

	const withHostCallbacks = useCallback(
		(next: Props): Props => ({
			...next,
			onError: (error: Error) => {
				next.onError?.(error)
				fail(error)
			},
		}),
		[fail],
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` re-runs the load on retry
	useEffect(() => {
		let cancelled = false
		setStatus({ kind: 'loading' })
		load().then(
			(module) => {
				if (!cancelled)
					setStatus({ kind: 'ready', module: module as RemoteModule<unknown> })
			},
			(error: unknown) => {
				if (!cancelled)
					fail(error instanceof Error ? error : new Error(String(error)))
			},
		)
		return () => {
			cancelled = true
		}
	}, [load, fail, attempt])

	const module = status.kind === 'ready' ? status.module : null

	useEffect(() => {
		const container = containerRef.current
		if (!module || !container) return
		try {
			mountedRef.current = (module as RemoteModule<Props>).mount(
				container,
				withHostCallbacks(propsRef.current),
			)
		} catch (error) {
			fail(error instanceof Error ? error : new Error(String(error)))
			return
		}
		return () => {
			mountedRef.current?.unmount()
			mountedRef.current = null
		}
	}, [module, withHostCallbacks, fail])

	useEffect(() => {
		mountedRef.current?.update(withHostCallbacks(props))
	}, [props, withHostCallbacks])

	const retry = useCallback(() => setAttempt((n) => n + 1), [])

	return (
		<div className={className} data-testid={testId}>
			{status.kind === 'loading' && fallback}
			{status.kind === 'error' && renderError(status.error, retry)}
			{/* Always rendered so the ref is stable; hidden until the remote is mounted. */}
			<div ref={containerRef} hidden={status.kind !== 'ready'} />
		</div>
	)
}
