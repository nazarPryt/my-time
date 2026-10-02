import type { BlockedSiteResponse } from 'contracts'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import {
	addBlockedSite,
	fetchBlockedSites,
	removeBlockedSite,
} from '../api/api'
import { requestExtensionSync } from '../lib/extension-protocol'
import { reinsertAt } from '../lib/reinsert-at'

export const SITES_ERRORS = {
	load: 'Failed to load blocked sites',
	add: 'Failed to block site',
	remove: 'Failed to remove site',
} as const

interface SiteBlockingState {
	sites: BlockedSiteResponse[]
	loading: boolean
	submitting: boolean
	error: string | null
	loadSites: () => Promise<void>
	addSite: (domain: string) => Promise<void>
	removeSite: (id: string) => Promise<void>
}

const useSiteBlockingStore = create<SiteBlockingState>((set, get) => ({
	sites: [],
	loading: true,
	submitting: false,
	error: null,

	loadSites: async () => {
		set({ loading: true, error: null })
		const { data, error } = await fetchBlockedSites()
		set(
			error
				? { loading: false, error: SITES_ERRORS.load }
				: { loading: false, sites: data ?? [] },
		)
	},

	addSite: async (domain) => {
		if (get().submitting) return
		set({ submitting: true, error: null })
		const { data, error } = await addBlockedSite(domain)
		if (error || !data || 'message' in data) {
			set({ submitting: false, error: SITES_ERRORS.add })
			return
		}
		set((s) => ({ submitting: false, sites: [...s.sites, data] }))
		requestExtensionSync()
	},

	// Optimistic: the row disappears at once and comes back if the server fails.
	removeSite: async (id) => {
		const index = get().sites.findIndex((site) => site.id === id)
		const removed = get().sites[index]
		if (!removed) return
		set((s) => ({ sites: s.sites.filter((site) => site.id !== id) }))

		const { error } = await removeBlockedSite(id)
		if (error) {
			set((s) => ({
				sites: reinsertAt(s.sites, removed, index),
				error: SITES_ERRORS.remove,
			}))
			return
		}
		requestExtensionSync()
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
