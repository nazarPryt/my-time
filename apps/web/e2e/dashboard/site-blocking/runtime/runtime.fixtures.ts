import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { type BrowserContext, test as base, chromium } from '@playwright/test'
import { RuntimePage } from './RuntimePage'
import { startRuntimeServer } from './runtime.mocks'

type Fixtures = {
	runtimeContext: BrowserContext
	runtimePage: RuntimePage
	extensionOrigin: string
	runtimeServer: Awaited<ReturnType<typeof startRuntimeServer>>
}
export const test = base.extend<Fixtures>({
	// biome-ignore lint/correctness/noEmptyPattern: Playwright requires fixture destructuring.
	runtimeServer: async ({}, use) => {
		const server = await startRuntimeServer()
		try {
			await use(server)
		} finally {
			await server.close()
		}
	},
	runtimeContext: async ({ runtimeServer }, use) => {
		void runtimeServer
		const profile = await mkdtemp(path.join(tmpdir(), 'my-time-extension-'))
		const extension = path.resolve('../extension/.output/chrome-mv3')
		const context = await chromium.launchPersistentContext(profile, {
			channel: 'chromium',
			headless: true,
			args: [
				`--disable-extensions-except=${extension}`,
				`--load-extension=${extension}`,
				'--no-proxy-server',
				'--host-resolver-rules=MAP *.localhost 127.0.0.1',
			],
		})
		try {
			await use(context)
		} finally {
			await context.close()
			await rm(profile, { recursive: true, force: true })
		}
	},
	extensionOrigin: async ({ runtimeContext }, use) => {
		const worker =
			runtimeContext.serviceWorkers()[0] ??
			(await runtimeContext.waitForEvent('serviceworker'))
		await use(`chrome-extension://${new URL(worker.url()).hostname}`)
	},
	runtimePage: async ({ runtimeContext, extensionOrigin }, use) => {
		void extensionOrigin
		await use(new RuntimePage(await runtimeContext.newPage()))
	},
})
export { expect } from '@playwright/test'
