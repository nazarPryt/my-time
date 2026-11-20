import {
	MarkReleaseSeenRequestSchema,
	RELEASES_ERRORS,
	RELEASES_ROUTES,
	ReleasesErrorSchema,
	SeenReleaseResponseSchema,
} from '@my-time/contracts'
import { authMacro } from '@shared/auth-macro'
import { Elysia } from 'elysia'
import { releasesService } from './service'

export const releasesPlugin = new Elysia({ prefix: RELEASES_ROUTES.prefix })
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(
				RELEASES_ROUTES.seen,
				async ({ userId }) => releasesService.getSeen(userId),
				{ response: { 200: SeenReleaseResponseSchema } },
			)
			.put(
				RELEASES_ROUTES.seen,
				async ({ userId, body, status }) => {
					const result = await releasesService.markSeen(userId, body.version)
					if (!result) {
						return status('Bad Request', RELEASES_ERRORS.UNKNOWN_VERSION)
					}
					return result
				},
				{
					body: MarkReleaseSeenRequestSchema,
					response: {
						200: SeenReleaseResponseSchema,
						400: ReleasesErrorSchema,
					},
				},
			),
	)
