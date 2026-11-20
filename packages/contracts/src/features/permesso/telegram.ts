import { z } from 'zod'

export const TelegramLinkResponseSchema = z.object({
	deepLink: z.string(),
})
export type TelegramLinkResponse = z.infer<typeof TelegramLinkResponseSchema>
