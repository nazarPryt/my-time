import { authMacro } from '@shared/auth-macro'
import {
	CreateBlockedSiteRequestSchema,
	SITE_BLOCKING_ERRORS,
	SITE_BLOCKING_ROUTES,
	SiteBlockingErrorSchema,
} from 'contracts'
import { Elysia } from 'elysia'
import { blockedSitesService } from './service'

export const siteBlockingPlugin = new Elysia({
	prefix: SITE_BLOCKING_ROUTES.prefix,
})
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(SITE_BLOCKING_ROUTES.root, async ({ userId }) => {
				return blockedSitesService.listSites(userId)
			})
			.post(
				SITE_BLOCKING_ROUTES.root,
				async ({ userId, body, set, status }) => {
					const result = await blockedSitesService.addSite(userId, body.domain)
					if (result.status === 'invalid') {
						return status('Bad Request', SITE_BLOCKING_ERRORS.INVALID_DOMAIN)
					}
					if (result.status === 'duplicate') {
						return status(
							'Conflict',
							SITE_BLOCKING_ERRORS.DOMAIN_ALREADY_BLOCKED,
						)
					}
					set.status = 201
					return result.site
				},
				{
					body: CreateBlockedSiteRequestSchema,
					response: {
						'Bad Request': SiteBlockingErrorSchema,
						Conflict: SiteBlockingErrorSchema,
					},
				},
			)
			.delete(SITE_BLOCKING_ROUTES.deleteById, async ({ userId, params }) => {
				await blockedSitesService.removeSite(userId, params.id)
			}),
	)
