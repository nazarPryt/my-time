import { z } from 'zod'

export const BlockedSiteResponseSchema = z.object({
	id: z.string().uuid(),
	domain: z.string(),
	createdAt: z.string(),
})
export type BlockedSiteResponse = z.infer<typeof BlockedSiteResponseSchema>

export const CreateBlockedSiteRequestSchema = z.object({
	domain: z.string().min(1).max(253),
})
export type CreateBlockedSiteRequest = z.infer<
	typeof CreateBlockedSiteRequestSchema
>

export const BlockedSiteListResponseSchema = z.array(BlockedSiteResponseSchema)
export type BlockedSiteListResponse = z.infer<
	typeof BlockedSiteListResponseSchema
>
