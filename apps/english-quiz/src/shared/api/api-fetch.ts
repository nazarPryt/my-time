import type { RemoteApiFetch } from '@my-time/mfe-contracts'
import { type InjectionKey, inject } from 'vue'

/** Provided by mount.ts from the host's `apiFetch` prop. */
export const API_FETCH_KEY: InjectionKey<RemoteApiFetch> = Symbol('apiFetch')

export function useApiFetch(): RemoteApiFetch {
	const apiFetch = inject(API_FETCH_KEY)
	if (!apiFetch) throw new Error('apiFetch was not provided')
	return apiFetch
}
