import { z } from 'zod'
import { ExchangeExtensionTokenResponseSchema } from './extension-token'

export const DesktopPairingIdSchema = z.uuid()
export const DesktopPairingRequestSchema = z.object({
	requestId: DesktopPairingIdSchema,
})
export const DesktopPairingStartSchema = z.object({
	requestId: DesktopPairingIdSchema,
	deviceSecret: z.string().regex(/^[a-f0-9]{64}$/),
	confirmationCode: z.string().regex(/^[A-F0-9]{8}$/),
	expiresIn: z.number().int().positive(),
	interval: z.number().int().positive(),
})
export const DesktopPairingPollRequestSchema =
	DesktopPairingRequestSchema.extend({
		deviceSecret: z.string().regex(/^[a-f0-9]{64}$/),
	})
export const DesktopPairingInfoSchema = z.object({
	confirmationCode: z.string().regex(/^[A-F0-9]{8}$/),
})
export const DesktopPairingPollSchema = z.discriminatedUnion('status', [
	z.object({ status: z.literal('pending') }),
	z.object({ status: z.literal('slow_down') }),
	z.object({ status: z.literal('expired') }),
	z.object({
		status: z.literal('connected'),
		email: z.email(),
		tokens: ExchangeExtensionTokenResponseSchema,
	}),
])
export type DesktopPairingStart = z.infer<typeof DesktopPairingStartSchema>
export type DesktopPairingPoll = z.infer<typeof DesktopPairingPollSchema>
