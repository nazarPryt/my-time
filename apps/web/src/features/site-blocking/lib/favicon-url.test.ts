import { describe, expect, test } from 'bun:test'
import { faviconUrl } from './favicon-url'

describe('faviconUrl', () => {
	test('asks Google for a 32px icon of the domain', () => {
		expect(faviconUrl('reddit.com')).toBe(
			'https://www.google.com/s2/favicons?domain=reddit.com&sz=32',
		)
	})

	test('encodes the domain so it cannot inject query params', () => {
		const url = new URL(faviconUrl('evil.com&sz=999'))
		expect(url.searchParams.get('domain')).toBe('evil.com&sz=999')
		expect(url.searchParams.getAll('sz')).toEqual(['32'])
	})
})
