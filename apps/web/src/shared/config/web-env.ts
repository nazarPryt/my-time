import { z } from 'zod'

const EnvSchema = z.object({
	VITE_API_URL: z.url(),
	// Unpublished extensions use the manual installation guide.
	VITE_EXTENSION_STORE_URL: z.union([z.url(), z.literal('')]).default(''),
})

export function parseWebEnv(values: unknown) {
	const result = EnvSchema.safeParse(values)
	if (!result.success) {
		const issues = result.error.issues.map(
			(issue) => `   • ${issue.path.join('.')}: ${issue.message}`,
		)
		throw new Error(
			`Missing or invalid web environment variables:\n${issues.join('\n')}`,
		)
	}
	return result.data
}
