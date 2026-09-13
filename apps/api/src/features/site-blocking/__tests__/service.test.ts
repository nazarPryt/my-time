import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { blockedSitesService } from '../service'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

describe('blockedSitesService', () => {
	describe('addSite', () => {
		it('normalizes the domain and returns { status: "created", site } on success', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)

			const result = await blockedSitesService.addSite(
				userId,
				'HTTPS://WWW.Example.com/some/path?x=1',
			)
			expect(result.status).toBe('created')
			if (result.status !== 'created') throw new Error('unreachable')
			expect(result.site.domain).toBe('example.com')
			expect(result.site.id).toBeTruthy()
			expect(result.site.createdAt).toBeTruthy()
		})

		it('returns { status: "duplicate" } when the normalized domain is already blocked', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await blockedSitesService.addSite(userId, 'example.com')

			const result = await blockedSitesService.addSite(
				userId,
				'https://www.example.com/',
			)
			expect(result).toEqual({ status: 'duplicate' })
		})

		it.each([
			['https://'],
			['http://'],
			['www.'],
			['/'],
			[''],
		])('returns { status: "invalid" } for raw input %p, which normalizes to an empty string', async (rawDomain) => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const result = await blockedSitesService.addSite(userId, rawDomain)
			expect(result).toEqual({ status: 'invalid' })
		})

		it('does not persist anything when the domain is invalid', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await blockedSitesService.addSite(userId, 'https://')

			const sites = await blockedSitesService.listSites(userId)
			expect(sites).toEqual([])
		})
	})

	describe('listSites', () => {
		it('returns an empty array for a fresh user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			expect(await blockedSitesService.listSites(userId)).toEqual([])
		})

		it('only returns sites belonging to the given user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)

			await blockedSitesService.addSite(userId, 'example.com')
			await blockedSitesService.addSite(otherUserId, 'other-example.com')

			const sites = await blockedSitesService.listSites(userId)
			expect(sites).toHaveLength(1)
			expect(sites[0]?.domain).toBe('example.com')
		})
	})

	describe('removeSite', () => {
		it('removes a site owned by the user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const created = await blockedSitesService.addSite(userId, 'example.com')
			if (created.status !== 'created') throw new Error('unreachable')

			await blockedSitesService.removeSite(userId, created.site.id)

			expect(await blockedSitesService.listSites(userId)).toEqual([])
		})

		it('does not remove a site owned by a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const created = await blockedSitesService.addSite(userId, 'example.com')
			if (created.status !== 'created') throw new Error('unreachable')

			await blockedSitesService.removeSite(otherUserId, created.site.id)

			const sites = await blockedSitesService.listSites(userId)
			expect(sites).toHaveLength(1)
			expect(sites[0]?.id).toBe(created.site.id)
		})

		it('is a no-op for a non-existent id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await expect(
				blockedSitesService.removeSite(
					userId,
					'00000000-0000-0000-0000-000000000000',
				),
			).resolves.toBeUndefined()
		})
	})
})
