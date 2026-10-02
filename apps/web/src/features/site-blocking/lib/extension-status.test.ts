import { describe, expect, test } from 'bun:test'
import {
	type BadgeVariant,
	type ExtensionStatus,
	extensionCardFor,
	isInstalled,
	isUpdateAvailable,
	snapshotFromReply,
	statusBadgeFor,
} from './extension-status'

const LATEST = '0.2.0'

describe('snapshotFromReply', () => {
	test('no reply means not installed', () => {
		expect(snapshotFromReply(null)).toEqual({
			status: 'not-installed',
			installedVersion: null,
		})
	})

	test('authenticated reply is linked, with its version', () => {
		expect(
			snapshotFromReply({ type: 'x', authenticated: true, version: '0.2.0' }),
		).toEqual({ status: 'linked', installedVersion: '0.2.0' })
	})

	test.each([
		false,
		undefined,
	])('authenticated: %p is not-linked', (authenticated) => {
		expect(snapshotFromReply({ type: 'x', authenticated }).status).toBe(
			'not-linked',
		)
	})

	test('a reply without a version keeps installedVersion null', () => {
		expect(
			snapshotFromReply({ type: 'x', authenticated: true }).installedVersion,
		).toBeNull()
	})
})

describe('isInstalled', () => {
	test.each<[ExtensionStatus, boolean]>([
		['checking', false],
		['not-installed', false],
		['not-linked', true],
		['linked', true],
	])('%s → %p', (status, expected) => {
		expect(isInstalled(status)).toBe(expected)
	})
})

describe('isUpdateAvailable', () => {
	test('true when the installed version is older', () => {
		expect(
			isUpdateAvailable(
				{ status: 'linked', installedVersion: '0.1.0' },
				LATEST,
			),
		).toBe(true)
	})

	test('true when an installed extension reports no version', () => {
		expect(
			isUpdateAvailable({ status: 'linked', installedVersion: null }, LATEST),
		).toBe(true)
	})

	test.each(['0.2.0', '0.3.0'])('false for %s (same or newer)', (version) => {
		expect(
			isUpdateAvailable(
				{ status: 'linked', installedVersion: version },
				LATEST,
			),
		).toBe(false)
	})

	test('also flags a not-linked extension (it is installed)', () => {
		expect(
			isUpdateAvailable(
				{ status: 'not-linked', installedVersion: '0.1.0' },
				LATEST,
			),
		).toBe(true)
	})

	test.each<ExtensionStatus>([
		'checking',
		'not-installed',
	])('never when %s', (status) => {
		expect(isUpdateAvailable({ status, installedVersion: null }, LATEST)).toBe(
			false,
		)
	})
})

describe('extensionCardFor', () => {
	test.each<[ExtensionStatus, boolean, ReturnType<typeof extensionCardFor>]>([
		['checking', false, null],
		['checking', true, null],
		['not-installed', false, 'setup'],
		['not-linked', false, 'setup'],
		['not-linked', true, 'setup'], // setup outranks the update
		['linked', false, null],
		['linked', true, 'update'],
	])('%s, updateAvailable=%p → %p', (status, updateAvailable, expected) => {
		expect(extensionCardFor(status, updateAvailable)).toBe(expected)
	})
})

describe('statusBadgeFor', () => {
	test.each<[ExtensionStatus, boolean, string, BadgeVariant]>([
		['checking', false, 'Checking extension…', 'outline'],
		['not-installed', false, 'Extension not installed', 'warning'],
		['not-linked', false, 'Extension not connected', 'warning'],
		['not-linked', true, 'Extension not connected', 'warning'],
		['linked', false, 'Extension active', 'success'],
		['linked', true, 'Extension update available', 'warning'],
	])('%s, updateAvailable=%p → "%s" (%s)', (status, update, label, variant) => {
		expect(statusBadgeFor(status, update)).toEqual({ label, variant })
	})
})
