import { afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { cleanDatabase, runMigrations } from '@/test/setup'
import { blockedSitesRepository } from '../repository'
import { OTHER_USER, registerAndGetToken, VALID_USER } from './fixtures'

beforeAll(async () => {
	await runMigrations()
	await cleanDatabase()
})

afterEach(async () => {
	await cleanDatabase()
})

describe('blockedSitesRepository', () => {
	describe('findByUserId', () => {
		it('returns an empty array for a user with no blocked sites', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const sites = await blockedSitesRepository.findByUserId(userId)
			expect(sites).toEqual([])
		})

		it('returns only the rows belonging to the given user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)

			await blockedSitesRepository.create(userId, 'example.com')
			await blockedSitesRepository.create(otherUserId, 'other-example.com')

			const sites = await blockedSitesRepository.findByUserId(userId)
			expect(sites).toHaveLength(1)
			expect(sites[0]?.domain).toBe('example.com')
			expect(sites[0]?.userId).toBe(userId)
		})
	})

	describe('create', () => {
		it('inserts a new row and returns it', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const site = await blockedSitesRepository.create(userId, 'example.com')
			expect(site?.domain).toBe('example.com')
			expect(site?.userId).toBe(userId)
			expect(site?.id).toBeTruthy()
			expect(site?.createdAt).toBeInstanceOf(Date)
		})

		it('returns null on a duplicate (userId, domain) pair via onConflictDoNothing', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const first = await blockedSitesRepository.create(userId, 'example.com')
			expect(first).not.toBeNull()

			const second = await blockedSitesRepository.create(userId, 'example.com')
			expect(second).toBeNull()

			const sites = await blockedSitesRepository.findByUserId(userId)
			expect(sites).toHaveLength(1)
		})

		it('allows the same domain for two different users', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)

			const first = await blockedSitesRepository.create(userId, 'shared.com')
			const second = await blockedSitesRepository.create(
				otherUserId,
				'shared.com',
			)
			expect(first).not.toBeNull()
			expect(second).not.toBeNull()
		})
	})

	describe('deleteById', () => {
		it('deletes a row that belongs to the given user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const site = await blockedSitesRepository.create(userId, 'example.com')

			await blockedSitesRepository.deleteById(userId, site?.id as string)

			const sites = await blockedSitesRepository.findByUserId(userId)
			expect(sites).toEqual([])
		})

		it('is a no-op when the id belongs to a different user', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			const { userId: otherUserId } = await registerAndGetToken(OTHER_USER)
			const site = await blockedSitesRepository.create(userId, 'example.com')

			await blockedSitesRepository.deleteById(otherUserId, site?.id as string)

			const sites = await blockedSitesRepository.findByUserId(userId)
			expect(sites).toHaveLength(1)
			expect(sites[0]?.id).toBe(site?.id)
		})

		it('is a no-op for a non-existent id', async () => {
			const { userId } = await registerAndGetToken(VALID_USER)
			await expect(
				blockedSitesRepository.deleteById(
					userId,
					'00000000-0000-0000-0000-000000000000',
				),
			).resolves.toBeNull()
		})
	})
})
