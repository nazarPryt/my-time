import { z } from 'zod'

// The government portal accepts two identifiers: a 10-character "numero di
// pratica" (practice number) or a 12-character "numero di assicurata"
// (insured number) — this is the single source of truth for both, used by
// the web form and the API route body.
export const PRACTICE_NUMBER_HINT =
	'Enter your 10-character practice number, or your 12-character insured (assicurata) number.'

export const PracticeNumberSchema = z
	.string()
	.trim()
	.regex(/^[A-Za-z0-9\-/]+$/, 'Only letters, numbers, - and / are allowed')
	.refine((value) => value.length === 10 || value.length === 12, {
		message: 'Must be 10 or 12 characters long',
	})

export const SetPracticeNumberRequestSchema = z.object({
	practiceNumber: PracticeNumberSchema,
})
export type SetPracticeNumberRequest = z.infer<
	typeof SetPracticeNumberRequestSchema
>
