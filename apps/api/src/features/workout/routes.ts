import { jwt } from '@elysiajs/jwt'
import { API_CONFIG } from '@shared/api-config'
import { Elysia, t } from 'elysia'
import { workoutService } from './service'

const jwtPlugin = jwt({
	name: 'jwt',
	secret: API_CONFIG.JWT_SECRET,
})

const AuthErrorSchema = t.Object({ code: t.String(), message: t.String() })

export const workoutPlugin = new Elysia({ prefix: '/workout' })
	.use(jwtPlugin)
	.get(
		'/today',
		async ({ headers, jwt, query, status }) => {
			const auth = headers.authorization
			if (!auth?.startsWith('Bearer ')) {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Missing token',
				})
			}
			const payload = await jwt.verify(auth.slice(7))
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Invalid token',
				})
			}
			return workoutService.getToday(payload.sub, query.exerciseType)
		},
		{
			query: t.Object({ exerciseType: t.String({ default: 'pushups' }) }),
			response: { 401: AuthErrorSchema },
		},
	)
	.post(
		'/sets',
		async ({ headers, jwt, body, status }) => {
			const auth = headers.authorization
			if (!auth?.startsWith('Bearer ')) {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Missing token',
				})
			}
			const payload = await jwt.verify(auth.slice(7))
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Invalid token',
				})
			}
			return workoutService.addSet(payload.sub, body.exerciseType, body.reps)
		},
		{
			body: t.Object({
				exerciseType: t.String({ default: 'pushups' }),
				reps: t.Number(),
			}),
			response: { 401: AuthErrorSchema },
		},
	)
	.delete(
		'/sets',
		async ({ headers, jwt, query, status }) => {
			const auth = headers.authorization
			if (!auth?.startsWith('Bearer ')) {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Missing token',
				})
			}
			const payload = await jwt.verify(auth.slice(7))
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Invalid token',
				})
			}
			await workoutService.resetToday(payload.sub, query.exerciseType)
		},
		{
			query: t.Object({ exerciseType: t.String({ default: 'pushups' }) }),
			response: { 401: AuthErrorSchema },
		},
	)
	.put(
		'/goal',
		async ({ headers, jwt, body, status }) => {
			const auth = headers.authorization
			if (!auth?.startsWith('Bearer ')) {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Missing token',
				})
			}
			const payload = await jwt.verify(auth.slice(7))
			if (!payload || typeof payload.sub !== 'string') {
				return status('Unauthorized', {
					code: 'UNAUTHORIZED',
					message: 'Invalid token',
				})
			}
			return workoutService.updateGoal(
				payload.sub,
				body.exerciseType,
				body.targetReps,
			)
		},
		{
			body: t.Object({
				exerciseType: t.String({ default: 'pushups' }),
				targetReps: t.Number(),
			}),
			response: { 401: AuthErrorSchema },
		},
	)
