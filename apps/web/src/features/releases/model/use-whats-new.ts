import { RELEASE_NOTES } from '@my-time/contracts'
import { useEffect, useMemo, useState } from 'react'
import { APP_VERSION } from '@/shared/config/app-version'
import { releasedNotes, unseenVersions } from '../lib/unseen-releases'
import { useReleasesStore } from './store'

export function useWhatsNew() {
	const lastSeenVersion = useReleasesStore((s) => s.lastSeenVersion)
	const load = useReleasesStore((s) => s.load)
	const markSeen = useReleasesStore((s) => s.markSeen)
	const notes = useMemo(() => releasedNotes(RELEASE_NOTES, APP_VERSION), [])
	// Captured on open, so "New" badges don't vanish while the dialog is showing.
	const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

	useEffect(() => {
		void load()
	}, [load])

	const unseen =
		lastSeenVersion === undefined
			? new Set<string>()
			: unseenVersions(RELEASE_NOTES, APP_VERSION, lastSeenVersion)
	const hasUnseen = unseen.size > 0

	function handleOpenChange(open: boolean) {
		if (!open) return
		setHighlighted(unseen)
		if (hasUnseen) void markSeen(APP_VERSION)
	}

	return { notes, highlighted, hasUnseen, handleOpenChange }
}
