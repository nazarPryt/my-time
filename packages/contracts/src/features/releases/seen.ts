import { z } from 'zod'
import { VersionSchema } from './version'

export const SeenReleaseResponseSchema = z.object({
	lastSeenVersion: VersionSchema.nullable(),
})
export type SeenReleaseResponse = z.infer<typeof SeenReleaseResponseSchema>

export const MarkReleaseSeenRequestSchema = z.object({
	version: VersionSchema,
})
export type MarkReleaseSeenRequest = z.infer<
	typeof MarkReleaseSeenRequestSchema
>

export const RELEASES_ERRORS = {
	UNKNOWN_VERSION: {
		code: 'UNKNOWN_VERSION',
		message: 'No release notes exist for this version',
	},
} as const

export const ReleasesErrorSchema = z.object({
	code: z.literal(RELEASES_ERRORS.UNKNOWN_VERSION.code),
	message: z.literal(RELEASES_ERRORS.UNKNOWN_VERSION.message),
})
