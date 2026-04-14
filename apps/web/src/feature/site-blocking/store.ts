import type { BlockedSiteResponse } from 'contracts'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { addBlockedSite, fetchBlockedSites, removeBlockedSite } from './api'

interface SiteBlockingState {
	sites: BlockedSiteResponse[]
	loading: boolean
	submitting: boolean
	error: string | null
	loadSites: () => Promise<void>
	addSite: (domain: string) => Promise<void>
	removeSite: (id: string) => Promise<void>
}

export const useSiteBlockingStore = create<SiteBlockingState>((set, get) => ({
	sites: [],
	loading: true,
	submitting: false,
	error: null,

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
}))

export const useSiteBlockingState = () =>
	useSiteBlockingStore(
		useShallow((s) => ({
			sites: s.sites,
			loading: s.loading,
			submitting: s.submitting,
			error: s.error,
		})),
	)

export const useSiteBlockingActions = () =>
	useSiteBlockingStore(
		useShallow((s) => ({
			loadSites: s.loadSites,
			addSite: s.addSite,
			removeSite: s.removeSite,
		})),
	)
