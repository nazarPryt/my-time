import { describe, expect, test } from 'bun:test'
import { stepLogPath } from './step-logs'

describe('stepLogPath', () => {
	test('numbers and slugs the log file so they sort in run order', () => {
		expect(stepLogPath('/logs', 0, 'Typecheck web E2E')).toBe(
			'/logs/01-typecheck-web-e2e.log',
		)
		expect(stepLogPath('/logs', 11, 'Start API-test database')).toBe(
			'/logs/12-start-api-test-database.log',
		)
	})
})
