import {
	ENGLISH_QUIZ_ERRORS,
	ENGLISH_QUIZ_ROUTES,
	EnglishQuizErrorSchema,
	ROUND_SIZE,
	RoundQuerySchema,
	RoundSchema,
	TopicListResponseSchema,
	TopicSchema,
} from '@my-time/contracts'
import { authMacro } from '@shared/auth-macro'
import { Elysia } from 'elysia'
import { englishQuizService } from './service'

export const englishQuizPlugin = new Elysia({
	prefix: ENGLISH_QUIZ_ROUTES.prefix,
})
	.use(authMacro)
	.guard({ auth: true }, (app) =>
		app
			.get(ENGLISH_QUIZ_ROUTES.topics, () => englishQuizService.listTopics(), {
				response: { 200: TopicListResponseSchema },
			})
			.get(
				ENGLISH_QUIZ_ROUTES.topicById,
				async ({ params, status }) =>
					(await englishQuizService.getTopic(params.id)) ??
					status('Not Found', ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND),
				{ response: { 200: TopicSchema, 404: EnglishQuizErrorSchema } },
			)
			.get(
				ENGLISH_QUIZ_ROUTES.round,
				async ({ params, query, status }) =>
					(await englishQuizService.getRound(
						params.id,
						query.size ?? ROUND_SIZE,
					)) ?? status('Not Found', ENGLISH_QUIZ_ERRORS.TOPIC_NOT_FOUND),
				{
					query: RoundQuerySchema,
					response: { 200: RoundSchema, 404: EnglishQuizErrorSchema },
				},
			),
	)
