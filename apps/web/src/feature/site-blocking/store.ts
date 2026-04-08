import type { BlockedSiteResponse } from 'contracts'
import { create } from 'zustand'
import {
	addBlockedSite,
	fetchBlockedSites,
	generateExtensionToken,
	removeBlockedSite,
} from './api'

interface SiteBlockingState {
	sites: BlockedSiteResponse[]
	loading: boolean
	submitting: boolean
	error: string | null
	connectingExtension: boolean
	loadSites: () => Promise<void>
	addSite: (domain: string) => Promise<void>
	removeSite: (id: string) => Promise<void>
	connectExtension: () => Promise<void>
}

export const useSiteBlockingStore = create<SiteBlockingState>((set, get) => ({
	sites: [],
	loading: true,
	submitting: false,
	error: null,
	connectingExtension: false,

	loadSites: async () => {
		set({ loading: true, error: null })
		const { data, error: err } = await fetchBlockedSites()
		if (err) {
			set({ error: 'Failed to load blocked sites', loading: false })
		} else {
			set({ sites: data ?? [], loading: false })
		}
	},

	addSite: async (domain) => {
		const { submitting } = get()
		if (submitting) return
		set({ submitting: true, error: null })
		const { data, error: err } = await addBlockedSite(domain)
		if (err || !data || 'message' in data) {
			set({ submitting: false, error: 'Failed to block site' })
		} else {
			set((s) => ({ submitting: false, sites: [...s.sites, data] }))
		}
	},

	removeSite: async (id) => {
		const prev = get().sites
		set((s) => ({ sites: s.sites.filter((s) => s.id !== id) }))
		const { error: err } = await removeBlockedSite(id)
		if (err) {
			set({ sites: prev, error: 'Failed to remove site' })
		}
	},

	connectExtension: async () => {
		if (get().connectingExtension) return
		set({ connectingExtension: true, error: null })
		const { data, error: err } = await generateExtensionToken()
		if (err || !data) {
			set({
				connectingExtension: false,
				error: 'Failed to generate connection token',
			})
			return
		}
		window.postMessage(
			{ type: 'MY_TIME_CONNECT', token: data.token },
			window.location.origin,
		)
		set({ connectingExtension: false })
	},
}))
