import { z } from 'zod'

const EnvSchema = z.object({
	VITE_API_URL: z.url(),
	// Unpublished extensions use the manual installation guide.
	VITE_EXTENSION_STORE_URL: z.union([z.url(), z.literal('')]).default(''),
	// Module Federation manifest of the English quiz micro frontend. Defaults
	// to the same-origin path proxied to the remote in dev (vite.config.ts)
	// and production (nginx.conf); override only to point at another host.
	VITE_ENGLISH_QUIZ_ENTRY: z
		.string()
		.min(1)
		.default('/remotes/english-quiz/mf-manifest.json'),
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
