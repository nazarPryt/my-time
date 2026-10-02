import { useEffect, useRef, useState } from 'react'

const COPIED_FEEDBACK_MS = 1500

/** `copy(text)` plus a `copied` flag that stays true briefly after success. */
export function useCopyToClipboard() {
	const [copied, setCopied] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	async function copy(text: string) {
		try {
			await navigator.clipboard.writeText(text)
		} catch {
			// Denied permission or an insecure context — the text stays visible
			// for the user to select by hand, so just skip the feedback.
			return
		}
		setCopied(true)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
	}

	return { copied, copy }
}
