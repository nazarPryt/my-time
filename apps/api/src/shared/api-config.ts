import { ZodError, z } from 'zod'

const EnvSchema = z.object({
	API_URL: z.url().default('http://localhost:3000'),
	FRONTEND_WEB_URL: z.url().default('http://localhost:5173'),
	JWT_SECRET: z.string().min(1),
	DATABASE_URL: z.string().min(1),
})

function parseEnv() {
	try {
		const result = EnvSchema.parse(process.env)
		console.log('✅ Environment variables parsed successfully')
		return result
	} catch (e) {
		if (e instanceof ZodError) {
			console.error('❌ Missing or invalid environment variables:')
			for (const issue of e.issues) {
				console.error(`   • ${issue.path.join('.')}: ${issue.message}`)
			}
			process.exit(1)
		}
		throw e
	}
}

const env = parseEnv()

const API_URL = new URL(env.API_URL)

export const API_CONFIG = {
	API_HOST: API_URL.hostname,
	API_PORT: Number(API_URL.port) || 3000,
	API_URL: API_URL.toString(),
	FRONTEND_WEB_URL: env.FRONTEND_WEB_URL,
	JWT_SECRET: env.JWT_SECRET,
	DATABASE_URL: env.DATABASE_URL,
}
