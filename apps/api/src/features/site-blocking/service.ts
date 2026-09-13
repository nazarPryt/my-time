import { logger } from '@shared/logger'
import { normalizeDomain } from '@shared/utils'
import type { BlockedSiteListResponse, BlockedSiteResponse } from 'contracts'
import { blockedSitesRepository } from './repository'

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

type AddSiteResult =
	| { status: 'created'; site: BlockedSiteResponse }
	| { status: 'duplicate' }
	| { status: 'invalid' }

export const blockedSitesService = {
	listSites: async (userId: string): Promise<BlockedSiteListResponse> => {
		const sites = await blockedSitesRepository.findByUserId(userId)
		return sites.map(toResponse)
	},

	addSite: async (
		userId: string,
		rawDomain: string,
	): Promise<AddSiteResult> => {
		const domain = normalizeDomain(rawDomain)
		if (!domain) {
			return { status: 'invalid' }
		}
		const site = await blockedSitesRepository.create(userId, domain)
		if (!site) {
			return { status: 'duplicate' }
		}
		logger.info({ userId, domain }, 'site blocked')
		return { status: 'created', site: toResponse(site) }
	},

	removeSite: async (userId: string, id: string): Promise<void> => {
		const site = await blockedSitesRepository.deleteById(userId, id)
		if (site) {
			logger.info({ userId, id }, 'site removed')
		}
	},
}
