export const MPRIS_PREFIX = 'org.mpris.MediaPlayer2.'
export const MPRIS_PATH = '/org/mpris/MediaPlayer2'
export const MPRIS_ROOT_INTERFACE = 'org.mpris.MediaPlayer2'
export const MPRIS_PLAYER_INTERFACE = 'org.mpris.MediaPlayer2.Player'

export type PlaybackStatus = 'playing' | 'paused' | 'stopped'

export interface PlayerSnapshot {
	status: PlaybackStatus
	title: string
	artist: string
	canPlayPause: boolean
	canGoNext: boolean
	canGoPrevious: boolean
}

/** Unpacked values of the org.mpris.MediaPlayer2.Player properties we read. */
export interface PlayerProperties {
	PlaybackStatus?: unknown
	Metadata?: unknown
	CanControl?: unknown
	CanPlay?: unknown
	CanPause?: unknown
	CanGoNext?: unknown
	CanGoPrevious?: unknown
}

// Browsers and VLC append a per-process suffix, e.g. firefox.instance_1_42.
const INSTANCE_SUFFIX = /\.instance[^.]*$/

/** Stable player id that survives restarts, or null for non-MPRIS names. */
export function playerIdFromBusName(busName: string): string | null {
	if (!busName.startsWith(MPRIS_PREFIX)) return null
	const id = busName.slice(MPRIS_PREFIX.length).replace(INSTANCE_SUFFIX, '')
	return id || null
}

export function busNameForPlayer(playerId: string): string {
	return MPRIS_PREFIX + playerId
}

export function matchesPlayer(busName: string, playerId: string): boolean {
	return playerIdFromBusName(busName) === playerId
}

/** Prefers the exact well-known name over instance-suffixed ones. */
export function pickBusName(
	busNames: Iterable<string>,
	playerId: string,
): string | null {
	const exact = busNameForPlayer(playerId)
	let first: string | null = null
	for (const name of busNames) {
		if (name === exact) return name
		if (!first && matchesPlayer(name, playerId)) first = name
	}
	return first
}

function parseStatus(value: unknown): PlaybackStatus {
	if (value === 'Playing') return 'playing'
	if (value === 'Paused') return 'paused'
	return 'stopped'
}

function text(value: unknown): string {
	if (typeof value === 'string') return value
	if (Array.isArray(value))
		return value.filter((item) => typeof item === 'string').join(', ')
	return ''
}

// The spec says missing capability properties should be treated as true,
// except that CanControl=false disables every control.
function allowed(value: unknown): boolean {
	return value !== false
}

export function snapshotFromProperties(
	properties: PlayerProperties,
): PlayerSnapshot {
	const status = parseStatus(properties.PlaybackStatus)
	const metadata =
		properties.Metadata && typeof properties.Metadata === 'object'
			? (properties.Metadata as Record<string, unknown>)
			: {}
	const control = allowed(properties.CanControl)
	return {
		status,
		title: text(metadata['xesam:title']),
		artist: text(metadata['xesam:artist']),
		canPlayPause:
			control &&
			(status === 'playing'
				? allowed(properties.CanPause)
				: allowed(properties.CanPlay)),
		canGoNext: control && allowed(properties.CanGoNext),
		canGoPrevious: control && allowed(properties.CanGoPrevious),
	}
}

export function trackLabel(snapshot: PlayerSnapshot): string {
	if (snapshot.title && snapshot.artist)
		return `${snapshot.title} — ${snapshot.artist}`
	return snapshot.title || snapshot.artist
}

export function sameSnapshot(a: PlayerSnapshot, b: PlayerSnapshot): boolean {
	return (
		a.status === b.status &&
		a.title === b.title &&
		a.artist === b.artist &&
		a.canPlayPause === b.canPlayPause &&
		a.canGoNext === b.canGoNext &&
		a.canGoPrevious === b.canGoPrevious
	)
}
