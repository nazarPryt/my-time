import * as fs from 'node:fs'
import * as path from 'node:path'
import { API_CONFIG } from '@shared/api-config'
import { format } from 'date-fns'
import puppeteer, { type Browser } from 'puppeteer'
import { extractPermessoStatus } from '../lib/result-parser'
import type { PermessoCheckResult } from '../types'
import { PORTAL_SELECTORS, PORTAL_TIMEOUTS } from './constants'

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots', 'permesso')

function readableTimestamp(): string {
	return format(new Date(), "yyyy-MM-dd'T'HH-mm-ss-SSSxxx")
}

/**
 * Submits a practice number to the government portal and scrapes the result
 * text back out of `.m-ok`. Missing records use a paragraph, while existing
 * records use direct text and strong elements inside the same container.
 */
export async function checkPermessoStatus(
	practiceNumber: string,
): Promise<PermessoCheckResult> {
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

		await page.waitForSelector(PORTAL_SELECTORS.practiceNumber, {
			timeout: PORTAL_TIMEOUTS.formMs,
		})
		await page.type(PORTAL_SELECTORS.practiceNumber, practiceNumber)
		await Promise.all([
			page.waitForNavigation({
				waitUntil: 'networkidle0',
				timeout: PORTAL_TIMEOUTS.navigationMs,
			}),
			page.click(PORTAL_SELECTORS.submit),
		])

		await page.waitForSelector(PORTAL_SELECTORS.result, {
			timeout: PORTAL_TIMEOUTS.resultMs,
		})
		const status = await page.$eval(
			PORTAL_SELECTORS.result,
			extractPermessoStatus,
		)
		if (!status) {
			throw new Error('The permit portal returned an empty status message')
		}

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
