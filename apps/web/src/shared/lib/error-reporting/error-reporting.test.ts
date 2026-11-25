import { describe, expect, test } from 'bun:test'
import type { ClientErrorReport } from '@my-time/contracts'
import { buildClientErrorReport } from './build-client-error-report'
import { createErrorReporter } from './create-error-reporter'

const META = { url: 'https://example.com/dashboard', appVersion: '1.2.3' }

describe('buildClientErrorReport', () => {
	test('keeps the error name, message and stack', () => {
		const error = new TypeError('x is undefined')
		const report = buildClientErrorReport(error, META)
		expect(report).toMatchObject({
			source: 'web',
			message: 'TypeError: x is undefined',
			url: META.url,
			appVersion: '1.2.3',
		})
		expect(report.stack).toBe(error.stack)
	})

	test('describes non-Error values and trims to the API limits', () => {
		expect(buildClientErrorReport('plain', META).message).toBe('plain')
		expect(buildClientErrorReport({ code: 1 }, META).message).toBe('{"code":1}')
		const long = buildClientErrorReport(new Error('x'.repeat(5000)), META)
		expect(long.message.length).toBe(1000)
	})
})

describe('createErrorReporter', () => {
	const report = (message: string): ClientErrorReport => ({
		source: 'web',
		message,
	})

	test('sends a repeated message once per minute', () => {
		const sent: string[] = []
		let now = 0
		const reporter = createErrorReporter(
			(r) => sent.push(r.message),
			() => now,
		)
		reporter(report('a'))
		reporter(report('a'))
		now = 60_000
		reporter(report('a'))
		expect(sent).toEqual(['a', 'a'])
	})

	test('stops after 20 reports per page load', () => {
		const sent: string[] = []
		const reporter = createErrorReporter((r) => sent.push(r.message))
		for (let i = 0; i < 25; i++) reporter(report(`error ${i}`))
		expect(sent).toHaveLength(20)
	})
})
