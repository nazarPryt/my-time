import { authMacro } from '@shared/auth-macro'
import { CreateBlockedSiteRequestSchema } from 'contracts'
import { Elysia } from 'elysia'
import { blockedSitesService } from './service'

export const siteBlockingPlugin = new Elysia({ prefix: '/site-blocking' })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get('/', async ({ userId }) => {
				return blockedSitesService.listSites(userId)
			})
			.post(
				'/',
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
			.delete('/:id', async ({ userId, params }) => {
				await blockedSitesService.removeSite(userId, params.id)
			}),
	)
