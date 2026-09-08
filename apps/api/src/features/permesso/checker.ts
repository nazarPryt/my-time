import * as fs from 'node:fs'
import * as path from 'node:path'
import { API_CONFIG } from '@shared/api-config'
import puppeteer, { type Browser } from 'puppeteer'

export type PermessoCheckResult =
	| { success: true; status: string }
	| { success: false; error: string }

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots', 'permesso')

function readableTimestamp(): string {
	return new Date().toISOString().replace(/[:.]/g, '-')
}

/**
 * Submits a practice number to the government portal and scrapes the result
 * text back out of the page. The result container is always `.m-ok`
 * (regardless of a positive or negative outcome — that distinction is only
 * encoded in an icon class inside it); the message text itself is in a `<p>`.
 */
export async function checkPermessoStatus(
	practiceNumber: string,
): Promise<PermessoCheckResult> {
	if (!API_CONFIG.PERMESSO_WEBSITE_URL) {
		return {
			success: false,
			error: 'Missing PERMESSO_WEBSITE_URL in environment',
		}
	}

	let browser: Browser | undefined
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})

		const page = await browser.newPage()
		await page.goto(API_CONFIG.PERMESSO_WEBSITE_URL, {
			waitUntil: 'networkidle0',
		})

		await page.waitForSelector('#pratica', { timeout: 10_000 })
		await page.type('#pratica', practiceNumber)
		await page.click('#invia')

		await page.waitForSelector('.m-ok', { timeout: 15_000 })
		const status = await page.$eval(
			'.m-ok p',
			(el) => el.textContent?.trim() ?? '',
		)

		await browser.close()
		return { success: true, status }
	} catch (error) {
		if (browser) {
			try {
				const page = (await browser.pages())[0]
				if (page) {
					fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
					const screenshotPath = path.join(
						SCREENSHOTS_DIR,
						`error_${readableTimestamp()}.png`,
					) as `${string}.png`
					await page.screenshot({ path: screenshotPath })
				}
			} catch {
				// best-effort debugging aid only — a failed screenshot must not mask the real error
			}
			await browser.close()
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		}
	}
}
