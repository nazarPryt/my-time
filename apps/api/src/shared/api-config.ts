import { ZodError, z } from 'zod'

const EnvSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	API_URL: z.url().default('http://localhost:3000'),
	FRONTEND_WEB_URL: z.url().default('http://localhost:5173'),
	JWT_SECRET: z.string().min(1),
	DATABASE_URL: z.string().min(1),
	HOST: z.string().default('0.0.0.0'),
	PORT: z.coerce.number().default(3000),
	LOG_LEVEL: z
		.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
		.default('info'),
	PERMESSO_WEBSITE_URL: z.string().min(1),
	TELEGRAM_BOT_TOKEN: z.string().min(1),
	// Must satisfy Telegram's setWebhook secret_token constraint — validating
	// here surfaces a bad value at boot instead of a stack trace deep inside
	// the Telegram bot library.
	TELEGRAM_WEBHOOK_SECRET: z
		.string()
		.regex(
			/^[A-Za-z0-9_-]{1,256}$/,
			'must be 1-256 characters of A-Z, a-z, 0-9, _ or - (Telegram secret_token constraint)',
		),
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

export const API_CONFIG = {
	NODE_ENV: env.NODE_ENV,
	API_HOST: env.HOST,
	API_PORT: env.PORT,
	LOG_LEVEL: env.LOG_LEVEL,
	API_URL: new URL(env.API_URL).toString(),
	FRONTEND_WEB_URL: env.FRONTEND_WEB_URL,
	JWT_SECRET: env.JWT_SECRET,
	DATABASE_URL: env.DATABASE_URL,
	PERMESSO_WEBSITE_URL: env.PERMESSO_WEBSITE_URL,
	TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
	TELEGRAM_WEBHOOK_SECRET: env.TELEGRAM_WEBHOOK_SECRET,
}
