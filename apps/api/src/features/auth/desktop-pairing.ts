import { createHash, randomBytes } from 'node:crypto'
import { logger } from '@shared/logger'
import type { DesktopPairingPoll, DesktopPairingStart } from 'contracts'
import { addMinutes, addSeconds } from 'date-fns'
import { desktopPairingRepository } from './desktop-pairing-repository'
import { type JwtHandle, signTokenPair } from './token'

const TTL_SECONDS = 300
const POLL_SECONDS = 5
const hash = (value: string) => createHash('sha256').update(value).digest('hex')

export const desktopPairingService = {
	async start(address: string): Promise<DesktopPairingStart | null> {
		const now = new Date()
		const deviceSecret = randomBytes(32).toString('hex')
		const row = await desktopPairingRepository.create({
			secretHash: hash(deviceSecret),
			requestKey: hash(address),
			confirmationCode: randomBytes(4).toString('hex').toUpperCase(),
			createdAt: now,
			expiresAt: addMinutes(now, 5),
			nextPollAt: addSeconds(now, POLL_SECONDS),
		})
		return row
			? {
					requestId: row.id,
					deviceSecret,
					confirmationCode: row.confirmationCode,
					expiresIn: TTL_SECONDS,
					interval: POLL_SECONDS,
				}
			: null
	},
	info: desktopPairingRepository.info,
	async approve(requestId: string, userId: string): Promise<boolean> {
		const approved = await desktopPairingRepository.approve(requestId, userId)
		if (approved) logger.info({ userId }, 'desktop connection approved')
		return approved
	},
	poll(
		jwt: JwtHandle,
		requestId: string,
		deviceSecret: string,
	): Promise<DesktopPairingPoll> {
		return desktopPairingRepository.poll(
			requestId,
			hash(deviceSecret),
			(userId) => signTokenPair(jwt, userId),
		)
	},
}
