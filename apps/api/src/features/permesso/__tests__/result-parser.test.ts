import { afterAll, beforeAll, expect, test } from 'bun:test'
import puppeteer, { type Browser, type Page } from 'puppeteer'
import { extractPermessoStatus } from '../lib/result-parser'
import { isPermessoReady } from '../lib/status'
import { formatCheckMessage } from '../telegram/messages'

let browser: Browser
let page: Page

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	})
	page = await browser.newPage()
})

afterAll(async () => {
	await browser?.close()
})

test('extracts the missing-record paragraph', async () => {
	await page.setContent(`<div class="m-ok">
		<span class="glyphicon glyphicon-remove-circle"></span><br>
		<p>Il documento di soggiorno non è presente in archivio.</p>
	</div>`)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe(
		'Il documento di soggiorno non è presente in archivio.',
	)
})

test('extracts an existing record without its practice-number link', async () => {
	await page.setContent(`<div class="m-ok">
		<span class="glyphicon glyphicon-remove-circle"></span><br>
		Stato del suo permesso di soggiorno:
		<strong>documento di soggiorno in trattazione.</strong><br><br>
		<span class="glyphicon glyphicon-link"></span>
		<a href="/servizio/stranieri?pratica=123">Permesso di soggiorno 123</a>
	</div>`)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe(
		'Stato del suo permesso di soggiorno: documento di soggiorno in trattazione.',
	)
})

test('preserves additional result details separated by line breaks', async () => {
	await page.setContent(
		`<div class="m-ok">Stato: <strong>pronto</strong><br>Ritiro: Questura</div>`,
	)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe(
		'Stato: pronto Ritiro: Questura',
	)
})

test('returns empty text for a result with only icons and a link', async () => {
	await page.setContent(
		`<div class="m-ok"><span class="glyphicon"></span><a>Permesso 123</a></div>`,
	)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe('')
})

test('keeps separate paragraphs readable even without HTML whitespace', async () => {
	await page.setContent(
		'<div class="m-ok"><p>Il documento è pronto per la consegna.</p><p>Attendere SMS.</p></div>',
	)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe(
		'Il documento è pronto per la consegna. Attendere SMS.',
	)
})

test('decodes entities, excludes non-message text, and leaves the page intact', async () => {
	await page.setContent(`<div class="m-ok"><span class="glyphicon">icon</span>
		<p>Il documento &egrave;&nbsp;in trattazione.</p>
		<script type="application/json">{"debug":"ignored"}</script>
		<style>.irrelevant { color: red }</style>
		<a href="/practice">Permesso 123</a><!-- ignored -->
	</div>`)
	const original = await page.$eval('.m-ok', (el) => el.innerHTML)
	expect(await page.$eval('.m-ok', extractPermessoStatus)).toBe(
		'Il documento è in trattazione.',
	)
	expect(await page.$eval('.m-ok', (el) => el.innerHTML)).toBe(original)
})

test('reconstructed ready layout reaches the Telegram ready message with collection details', async () => {
	// Wording is transcribed from ready.jpg; its actual HTML is unknown.
	await page.setContent(`<div class="m-ok">
		<span class="glyphicon glyphicon-ok-circle"></span><br>
		<strong>Il documento di soggiorno è pronto per la consegna.<br>
		In consegna, con sms le verrà indicato quando e dove ritirare il permesso di soggiorno</strong><br>
		Lo può ritirare presso:<br>
		<strong>UFFICIO IMMIGRAZIONE PRESSO UFFICIO STRANIERI POLIZIA - CASERTA</strong>
		<a href="/office">Orari Questura - Caserta</a>
	</div>`)
	const status = await page.$eval('.m-ok', extractPermessoStatus)
	expect(status).toBe(
		'Il documento di soggiorno è pronto per la consegna. In consegna, con sms le verrà indicato quando e dove ritirare il permesso di soggiorno Lo può ritirare presso: UFFICIO IMMIGRAZIONE PRESSO UFFICIO STRANIERI POLIZIA - CASERTA',
	)
	expect(isPermessoReady(status)).toBe(true)
	expect(
		formatCheckMessage({ success: true, status }, isPermessoReady(status)),
	).toBe(`🎉 *Your permesso is ready!*\n\n📄 Status: ${status}`)
})

test('unknown wording stays a successful normal Telegram notification', async () => {
	await page.setContent(
		'<div class="m-ok"><strong>Nuovo stato del documento.</strong></div>',
	)
	const status = await page.$eval('.m-ok', extractPermessoStatus)
	expect(isPermessoReady(status)).toBe(false)
	expect(
		formatCheckMessage({ success: true, status }, isPermessoReady(status)),
	).toBe(
		'✅ *Permesso check complete*\n\n📄 Status: Nuovo stato del documento.',
	)
})

test.each([
	'ROMA',
	'MILANO',
	'REGGIO CALABRIA',
])('preserves the portal collection location for %s', async (city) => {
	await page.setContent(`<div class="m-ok">
			<strong>Il documento di soggiorno è pronto per la consegna.</strong><br>
			Lo può ritirare presso:<br><strong>QUESTURA DI ${city}</strong>
		</div>`)
	const status = await page.$eval('.m-ok', extractPermessoStatus)
	expect(status).toBe(
		`Il documento di soggiorno è pronto per la consegna. Lo può ritirare presso: QUESTURA DI ${city}`,
	)
	expect(isPermessoReady(status)).toBe(true)
	const notification = formatCheckMessage(
		{ success: true, status },
		isPermessoReady(status),
	)
	expect(notification).toContain(`QUESTURA DI ${city}`)
	expect(notification).not.toContain('CASERTA')
})
