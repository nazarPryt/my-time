import { describe, expect, test } from 'bun:test'
import { isOlderVersion } from './is-older-version'

describe('isOlderVersion', () => {
	test.each([
		['0.1.0', '0.2.0'],
		['0.2.9', '0.3.0'],
		['1.9.0', '1.10.0'], // numeric, not string, comparison
		['1.2', '1.2.1'], // missing part counts as 0
	])('%s is older than %s', (installed, latest) => {
		expect(isOlderVersion(installed, latest)).toBe(true)
	})

	test.each([
		['0.2.0', '0.2.0'],
		['1.2', '1.2.0'],
		['0.3.0', '0.2.0'], // installed newer than latest (e.g. a dev build)
		['1.10.0', '1.9.0'],
	])('%s is not older than %s', (installed, latest) => {
		expect(isOlderVersion(installed, latest)).toBe(false)
	})
})
