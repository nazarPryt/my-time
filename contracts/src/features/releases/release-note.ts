import { z } from 'zod'
import { VersionSchema } from './version'

export const ReleaseNoteSchema = z.object({
	version: VersionSchema,
	// yyyy-MM-dd
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	features: z.array(z.string().min(1)),
	fixes: z.array(z.string().min(1)),
})
export type ReleaseNote = z.infer<typeof ReleaseNoteSchema>
