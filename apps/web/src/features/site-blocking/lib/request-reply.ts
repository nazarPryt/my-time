/** The slice of `window` this helper needs — lets unit tests pass a fake. */
export interface MessageTarget {
	readonly location: { readonly origin: string }
	postMessage(message: unknown, targetOrigin: string): void
	addEventListener(
		type: 'message',
		listener: (event: IncomingMessage) => void,
	): void
	removeEventListener(
		type: 'message',
		listener: (event: IncomingMessage) => void,
	): void
}

/** A protocol message: a `type` plus whatever payload it carries. */
export interface TypedMessage {
	readonly type: string
	readonly [key: string]: unknown
}

export interface IncomingMessage {
	readonly data: unknown
	readonly origin: string
	readonly source: unknown
}

/**
 * True for a message of `type` posted by this same window — which is how the
 * extension's content script talks to the page. Rejects lookalikes posted by
 * iframes or other origins.
 */
export function isOwnMessage<T extends { type: string }>(
	target: MessageTarget,
	event: IncomingMessage,
	type: string,
): event is IncomingMessage & { data: T } {
	return (
		event.source === target &&
		event.origin === target.location.origin &&
		typeof event.data === 'object' &&
		event.data !== null &&
		(event.data as { type?: unknown }).type === type
	)
}

/**
 * Posts `message` to this window and resolves with the first own message of
 * `replyType`, or `null` once `timeoutMs` passes with no reply. The listener
 * is always removed, whichever comes first.
 */
export function postAndAwaitReply<T extends { type: string }>(
	target: MessageTarget,
	message: TypedMessage,
	replyType: string,
	timeoutMs: number,
): Promise<T | null> {
	return new Promise((resolve) => {
		const timer = setTimeout(() => finish(null), timeoutMs)

		function onMessage(event: IncomingMessage) {
			if (isOwnMessage<T>(target, event, replyType)) finish(event.data)
		}

		function finish(reply: T | null) {
			clearTimeout(timer)
			target.removeEventListener('message', onMessage)
			resolve(reply)
		}

		target.addEventListener('message', onMessage)
		target.postMessage(message, target.location.origin)
	})
}
