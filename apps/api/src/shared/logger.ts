import { pino } from 'pino'
import { API_CONFIG } from './api-config'

// Pretty-printed logs are only readable locally; in production (and in Docker
// on the VPS) we emit plain JSON lines to stdout so Promtail/Loki can parse them.
const transport =
	API_CONFIG.NODE_ENV === 'development'
		? { target: 'pino-pretty', options: { colorize: true } }
		: undefined

export const logger = pino({
	level: API_CONFIG.LOG_LEVEL,
	transport,
	// Log the level as a string ("info", "error") instead of pino's default
	// numeric code — that's what makes it usable as a Loki label/filter.
	formatters: {
		level: (label) => ({ level: label }),
	},
	// Never let secrets end up in logs even if a caller passes a body/headers object.
	redact: {
		paths: [
			'password',
			'passwordHash',
			'*.password',
			'*.passwordHash',
			'req.headers.authorization',
			'req.headers.cookie',
			'*.accessToken',
			'*.refreshToken',
			'*.token',
		],
		censor: '[REDACTED]',
	},
	base: { service: 'api' },
})
