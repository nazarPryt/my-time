import { logger } from './logger'

type ShutdownHook = () => Promise<void> | void
const shutdownHooks: ShutdownHook[] = []
let shuttingDown = false

/** Registers cleanup to run on SIGTERM/SIGINT (e.g. stop accepting requests). */
export function onShutdown(hook: ShutdownHook): void {
	shutdownHooks.push(hook)
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
	if (shuttingDown) return
	shuttingDown = true
	logger.info({ signal }, 'shutdown signal received')
	for (const hook of shutdownHooks) {
		try {
			await hook()
		} catch (error) {
			logger.error({ err: error }, 'shutdown hook failed')
		}
	}
	process.exit(0)
}

/**
 * Routes crashes through pino so they reach Loki: without this, an uncaught
 * error kills the container with nothing but a raw stack in Docker's log.
 */
export function installProcessHandlers(): void {
	process.on('unhandledRejection', (reason) => {
		logger.error({ err: reason }, 'unhandled promise rejection')
	})
	process.on('uncaughtException', (error) => {
		logger.fatal({ err: error }, 'uncaught exception')
		process.exit(1)
	})
	process.on('SIGTERM', () => void shutdown('SIGTERM'))
	process.on('SIGINT', () => void shutdown('SIGINT'))
}
