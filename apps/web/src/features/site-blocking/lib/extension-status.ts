import type { ExtensionStatusReply } from './extension-protocol'
import { isOlderVersion } from './is-older-version'

// checking      → waiting for the ping reply
// not-installed → no content script answered
// not-linked    → extension answered but holds no tokens for this account
// linked        → extension is signed in and enforcing the block list
export type ExtensionStatus =
	| 'checking'
	| 'not-installed'
	| 'not-linked'
	| 'linked'

export interface ExtensionSnapshot {
	status: ExtensionStatus
	/** null when not installed, or when the extension predates version reporting */
	installedVersion: string | null
}

/** Turns a ping/ready reply (or `null` for no reply) into store state. */
export function snapshotFromReply(
	reply: ExtensionStatusReply | null,
): ExtensionSnapshot {
	if (!reply) return { status: 'not-installed', installedVersion: null }
	return {
		status: reply.authenticated === true ? 'linked' : 'not-linked',
		installedVersion: reply.version ?? null,
	}
}

export function isInstalled(status: ExtensionStatus): boolean {
	return status === 'not-linked' || status === 'linked'
}

/**
 * An installed extension without a version predates version reporting, so
 * it's older than any release that has it.
 */
export function isUpdateAvailable(
	{ status, installedVersion }: ExtensionSnapshot,
	latestVersion: string,
): boolean {
	if (!isInstalled(status)) return false
	return (
		installedVersion === null || isOlderVersion(installedVersion, latestVersion)
	)
}

export type ExtensionCard = 'setup' | 'update' | null

/**
 * Which card the page shows above the block list. Setup comes first: an
 * update only matters once the extension is working. Nothing while checking,
 * so the setup guide doesn't flash for users who already have it.
 */
export function extensionCardFor(
	status: ExtensionStatus,
	updateAvailable: boolean,
): ExtensionCard {
	if (status === 'not-installed' || status === 'not-linked') return 'setup'
	if (status === 'linked' && updateAvailable) return 'update'
	return null
}

export type BadgeVariant = 'success' | 'warning' | 'outline'

const STATUS_LABELS: Record<ExtensionStatus, string> = {
	checking: 'Checking extension…',
	'not-installed': 'Extension not installed',
	'not-linked': 'Extension not connected',
	linked: 'Extension active',
}

/** Label and colour of the header badge. */
export function statusBadgeFor(
	status: ExtensionStatus,
	updateAvailable: boolean,
): { label: string; variant: BadgeVariant } {
	if (status === 'checking') {
		return { label: STATUS_LABELS.checking, variant: 'outline' }
	}
	if (status === 'linked') {
		return updateAvailable
			? { label: 'Extension update available', variant: 'warning' }
			: { label: STATUS_LABELS.linked, variant: 'success' }
	}
	// Install/connect problems outrank an update — they mean nothing is blocked.
	return { label: STATUS_LABELS[status], variant: 'warning' }
}
