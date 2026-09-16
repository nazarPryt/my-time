import { describe, expect, it } from 'bun:test'
import { normalizeDomain } from './normalizeDomain'

describe('normalizeDomain', () => {
	it('lowercases the domain', () => {
		expect(normalizeDomain('Example.COM')).toBe('example.com')
	})

	it('strips the http:// protocol', () => {
		expect(normalizeDomain('http://example.com')).toBe('example.com')
	})

	it('strips the https:// protocol', () => {
		expect(normalizeDomain('https://example.com')).toBe('example.com')
	})

	it('strips a leading www.', () => {
		expect(normalizeDomain('www.example.com')).toBe('example.com')
	})

	it('strips protocol and www. together', () => {
		expect(normalizeDomain('https://www.example.com')).toBe('example.com')
	})

	it('strips a path', () => {
		expect(normalizeDomain('example.com/path/to/page')).toBe('example.com')
	})

	it('strips a query string', () => {
		expect(normalizeDomain('example.com?foo=bar')).toBe('example.com')
	})

	it('strips a path followed by a query string', () => {
		expect(normalizeDomain('example.com/path?foo=bar')).toBe('example.com')
	})

	it('handles protocol, www, path, and query string together', () => {
		expect(normalizeDomain('HTTPS://WWW.Example.com/Some/Path?foo=bar')).toBe(
			'example.com',
		)
	})

	it('leaves a bare domain unchanged', () => {
		expect(normalizeDomain('example.com')).toBe('example.com')
	})

	it('preserves non-www subdomains', () => {
		expect(normalizeDomain('https://mail.example.com')).toBe('mail.example.com')
	})

	it('only strips a leading www., not one occurring later', () => {
		expect(normalizeDomain('notwww.example.com')).toBe('notwww.example.com')
	})
})
