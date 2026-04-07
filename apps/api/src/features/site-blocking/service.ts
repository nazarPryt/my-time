import type { BlockedSiteListResponse, BlockedSiteResponse } from 'contracts'
import { blockedSitesRepository } from './repository'

function normalizeDomain(input: string): string {
	// Strip protocol, www, paths, and lowercase
	return input
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.split('/')[0]
		.split('?')[0]
}

function toResponse(site: {
	id: string
	domain: string
	createdAt: Date
}): BlockedSiteResponse {
	return {
		id: site.id,
		domain: site.domain,
		createdAt: site.createdAt.toISOString(),
	}
}

export const blockedSitesService = {
	listSites: async (userId: string): Promise<BlockedSiteListResponse> => {
		const sites = await blockedSitesRepository.findByUserId(userId)
		return sites.map(toResponse)
	},

	addSite: async (
		userId: string,
		rawDomain: string,
	): Promise<BlockedSiteResponse | null> => {
		const domain = normalizeDomain(rawDomain)
		const site = await blockedSitesRepository.create(userId, domain)
		return site ? toResponse(site) : null
	},

	removeSite: async (userId: string, id: string): Promise<void> => {
		await blockedSitesRepository.deleteById(userId, id)
	},
}
