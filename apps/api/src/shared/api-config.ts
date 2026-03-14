const API_URL = new URL(process.env.API_URL || 'http://localhost')

export const API_CONFIG = {
	PORT: Number(process.env.PORT) || 3000,
	HOSTNAME: API_URL.hostname,
	API_URL: API_URL.toString(),
	FRONTEND_WEB_URL: process.env.FRONTEND_WEB_URL || 'http://localhost:5173',
	JWT_SECRET: process.env.JWT_SECRET || 'secret',
	DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/my_time',
}