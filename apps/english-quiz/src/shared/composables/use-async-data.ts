import {
	type ComputedRef,
	computed,
	type MaybeRefOrGetter,
	shallowRef,
	toValue,
	watch,
} from 'vue'

/** Read-only to consumers: only this composable writes the state. */
export interface AsyncData<T> {
	data: ComputedRef<T | null>
	pending: ComputedRef<boolean>
	error: ComputedRef<Error | null>
	reload: () => void
}

/**
 * Loads `load(key)` whenever `key` changes. A response that arrives after a
 * newer request started is ignored, so a slow answer never overwrites a fresh
 * one.
 */
export function useAsyncData<K, T>(
	key: MaybeRefOrGetter<K>,
	load: (key: K) => Promise<T>,
): AsyncData<T> {
	const data = shallowRef<T | null>(null)
	const pending = shallowRef(true)
	const error = shallowRef<Error | null>(null)
	let request = 0

	async function run(currentKey: K) {
		const id = ++request
		pending.value = true
		error.value = null
		try {
			const result = await load(currentKey)
			if (id === request) data.value = result
		} catch (cause) {
			if (id === request) {
				data.value = null
				error.value = cause instanceof Error ? cause : new Error(String(cause))
			}
		} finally {
			if (id === request) pending.value = false
		}
	}

	watch(() => toValue(key), run, { immediate: true })

	return {
		data: computed(() => data.value),
		pending: computed(() => pending.value),
		error: computed(() => error.value),
		reload: () => run(toValue(key)),
	}
}
