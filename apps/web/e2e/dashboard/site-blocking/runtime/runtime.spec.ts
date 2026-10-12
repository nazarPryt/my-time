import { expect, test } from './runtime.fixtures'
import {
	ALLOWED_DOMAIN,
	BLOCKED_DOMAIN,
	FIRST_ACCOUNT,
	FIRST_CONNECT_TOKEN,
	RUNTIME_EMAIL,
	RUNTIME_ORIGIN,
	RUNTIME_PASSWORD,
	SECOND_ACCOUNT,
	SECOND_CONNECT_TOKEN,
	SECOND_DOMAIN,
} from './runtime.mocks'

const siteUrl = (domain: string) =>
	`${RUNTIME_ORIGIN.replace('127.0.0.1', domain)}/article`

test('packaged extension redirects blocked domains and subdomains while allowing unrelated pages', async ({
	runtimePage,
	extensionOrigin,
	runtimeServer,
}) => {
	await runtimePage.login(extensionOrigin, RUNTIME_EMAIL, RUNTIME_PASSWORD)
	await expect(runtimePage.blockedCount).toHaveText('1')
	expect(runtimeServer.requests).toContain(
		`Bearer ${FIRST_ACCOUNT.accessToken}`,
	)
	for (const domain of [BLOCKED_DOMAIN, `news.${BLOCKED_DOMAIN}`]) {
		await runtimePage.page.goto(siteUrl(domain))
		await expect(runtimePage.page).toHaveURL(
			`${extensionOrigin}/block.html?domain=${BLOCKED_DOMAIN}`,
		)
		await expect(runtimePage.blockedDomain).toHaveText(BLOCKED_DOMAIN)
	}
	await runtimePage.page.goto(siteUrl(ALLOWED_DOMAIN))
	await expect(runtimePage.runtimeContent).toBeVisible()
	await expect(runtimePage.page).toHaveURL(siteUrl(ALLOWED_DOMAIN))
	await runtimePage.page.goto(siteUrl(BLOCKED_DOMAIN))
	await runtimePage.blockedReturn.click()
	await expect(runtimePage.page).toHaveURL(siteUrl(ALLOWED_DOMAIN))
})

test('connecting another account replaces the previous account blocking rules', async ({
	runtimePage,
	extensionOrigin,
	runtimeServer,
}) => {
	expect(await runtimePage.connect(FIRST_CONNECT_TOKEN, RUNTIME_ORIGIN)).toBe(
		true,
	)
	expect(await runtimePage.connect(SECOND_CONNECT_TOKEN, RUNTIME_ORIGIN)).toBe(
		true,
	)
	expect(runtimeServer.requests).toContain(
		`Bearer ${SECOND_ACCOUNT.accessToken}`,
	)
	await runtimePage.page.goto(siteUrl(BLOCKED_DOMAIN))
	await expect(runtimePage.runtimeContent).toBeVisible()
	await runtimePage.page.goto(siteUrl(SECOND_DOMAIN))
	await expect(runtimePage.page).toHaveURL(
		`${extensionOrigin}/block.html?domain=${SECOND_DOMAIN}`,
	)
})

test('popup sign-out clears cached sites, credentials and active navigation rules', async ({
	runtimePage,
	extensionOrigin,
}) => {
	await runtimePage.login(extensionOrigin, RUNTIME_EMAIL, RUNTIME_PASSWORD)
	await expect(runtimePage.blockedCount).toHaveText('1')
	await runtimePage.signout.click()
	await expect(runtimePage.loginButton).toBeVisible()
	await runtimePage.page.reload()
	await expect(runtimePage.loginButton).toBeVisible()
	await runtimePage.page.goto(siteUrl(BLOCKED_DOMAIN))
	await expect(runtimePage.runtimeContent).toBeVisible()
	await runtimePage.login(extensionOrigin, RUNTIME_EMAIL, RUNTIME_PASSWORD)
	await expect(runtimePage.blockedCount).toHaveText('1')
	await runtimePage.page.goto(siteUrl(BLOCKED_DOMAIN))
	await expect(runtimePage.page).toHaveURL(
		`${extensionOrigin}/block.html?domain=${BLOCKED_DOMAIN}`,
	)
})
