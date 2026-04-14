import { authMacro } from '@shared/auth-macro'
import { CreateBlockedSiteRequestSchema, SITE_BLOCKING_ROUTES } from 'contracts'
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
				async ({ userId, body, set }) => {
					const site = await blockedSitesService.addSite(userId, body.domain)
					if (!site) {
						set.status = 409
						return { message: 'Domain already blocked' }
					}
					set.status = 201
					return site
				},
				{ body: CreateBlockedSiteRequestSchema },
			)
			.delete(SITE_BLOCKING_ROUTES.deleteById, async ({ userId, params }) => {
				await blockedSitesService.removeSite(userId, params.id)
			}),
	)
