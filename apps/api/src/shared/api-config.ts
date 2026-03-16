const API_URL = new URL(process.env.API_URL || 'http://localhost:3000')

export const API_CONFIG = {
	API_HOST: API_URL.hostname,
	API_PORT: Number(API_URL.port) || 3000,
	API_URL: API_URL.toString(),
	FRONTEND_WEB_URL: process.env.FRONTEND_WEB_URL || 'http://localhost:5173',
	JWT_SECRET: process.env.JWT_SECRET || 'secret',
	DATABASE_URL:
		process.env.DATABASE_URL ||
		`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
}
