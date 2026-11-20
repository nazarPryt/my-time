import { expect, test } from 'bun:test'
import { elapsedSeconds, formatElapsed } from './elapsed'
import { normalizeApiUrl, normalizeUrl } from './urls'

test('normalizes API addresses without duplicating the version prefix', () => {
	expect(normalizeApiUrl(' https://example.com/ ')).toBe(
		'https://example.com/api/v1',
	)
	expect(normalizeApiUrl('http://localhost:3000/api/v1/')).toBe(
		'http://localhost:3000/api/v1',
	)
	expect(normalizeApiUrl('https://example.com/service/api/v1')).toBe(
		'https://example.com/service/api/v1',
	)
})

test('requires HTTPS outside loopback and rejects credential-bearing or ambiguous URLs', () => {
	for (const url of [
		'http://example.com',
		'https://user:password@example.com',
		'https://example.com?token=secret',
		'https://example.com#token',
		'file:///tmp/test',
		'https://example.com:99999',
		'https://example.com\\@other.com',
	]) {
		expect(() => normalizeUrl(url)).toThrow()
	}
	expect(normalizeUrl('http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000')
})

test('uses the session timestamp across restarts and clamps clock skew', () => {
	const session = {
		id: 's1',
		type: 'work' as const,
		startedAt: new Date('2026-10-08T08:00:00Z'),
		endedAt: null,
		abandonedAt: null,
	}
	expect(elapsedSeconds(session, new Date('2026-10-08T09:02:03Z'))).toBe(3723)
	expect(elapsedSeconds(session, new Date('2026-10-08T07:59:59Z'))).toBe(0)
	expect(formatElapsed(3723)).toBe('01:02:03')
})
