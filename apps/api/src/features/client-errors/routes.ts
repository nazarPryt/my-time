import { jwt } from '@elysiajs/jwt'
import {
	CLIENT_ERRORS_ROUTES,
	ClientErrorReportSchema,
} from '@my-time/contracts'
import { API_CONFIG } from '@shared/api-config'
import { Elysia } from 'elysia'
import { clientErrorsService } from './service'

const jwtPlugin = jwt({ name: 'jwt', secret: API_CONFIG.JWT_SECRET })

async function optionalUserId(
	authorization: string | undefined,
	verify: (token: string) => Promise<false | { sub?: unknown }>,
): Promise<string | undefined> {
	if (!authorization?.startsWith('Bearer ')) return undefined
	const payload = await verify(authorization.slice(7))
	return payload && typeof payload.sub === 'string' ? payload.sub : undefined
}

export const clientErrorsPlugin = new Elysia({
	prefix: CLIENT_ERRORS_ROUTES.prefix,
})
	.use(jwtPlugin)
	.post(
		CLIENT_ERRORS_ROUTES.root,
		async ({ body, headers, request, server, jwt, status }) => {
			const clientKey =
				headers['x-forwarded-for']?.split(',')[0]?.trim() ||
				server?.requestIP(request)?.address ||
				'unknown'
			const accepted = clientErrorsService.report(body, {
				clientKey,
				userAgent: headers['user-agent']?.slice(0, 300),
				userId: await optionalUserId(headers.authorization, jwt.verify),
			})
			return accepted ? status(204) : status('Too Many Requests')
		},
		{ body: ClientErrorReportSchema },
	)
