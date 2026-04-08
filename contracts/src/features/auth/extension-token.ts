import { z } from 'zod'

export const ExtensionTokenResponseSchema = z.object({
	token: z.string().uuid(),
})
export type ExtensionTokenResponse = z.infer<
	typeof ExtensionTokenResponseSchema
>

export const ExchangeExtensionTokenRequestSchema = z.object({
	token: z.string().uuid(),
})
export type ExchangeExtensionTokenRequest = z.infer<
	typeof ExchangeExtensionTokenRequestSchema
>

export const ExchangeExtensionTokenResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
})
export type ExchangeExtensionTokenResponse = z.infer<
	typeof ExchangeExtensionTokenResponseSchema
>

export const ExtensionRefreshRequestSchema = z.object({
	refreshToken: z.string(),
})
export type ExtensionRefreshRequest = z.infer<
	typeof ExtensionRefreshRequestSchema
>
