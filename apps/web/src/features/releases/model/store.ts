import { create } from 'zustand'
import { fetchSeenRelease, markReleaseSeen } from '../api/api'

interface ReleasesState {
	// undefined until loaded; the dot stays hidden on load failure.
	lastSeenVersion: string | null | undefined
	load: () => Promise<void>
	markSeen: (version: string) => Promise<void>
}

export const useReleasesStore = create<ReleasesState>((set) => ({
	lastSeenVersion: undefined,

	load: async () => {
		const { data, error } = await fetchSeenRelease()
		if (error || !data) return
		set({ lastSeenVersion: data.lastSeenVersion })
	},

	markSeen: async (version) => {
		const previous = useReleasesStore.getState().lastSeenVersion
		set({ lastSeenVersion: version })
		const { data, error } = await markReleaseSeen(version)
		if (error || !data) {
			set({ lastSeenVersion: previous })
			return
		}
		set({ lastSeenVersion: data.lastSeenVersion })
	},
}))
