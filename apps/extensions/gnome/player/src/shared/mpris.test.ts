import { describe, expect, test } from 'bun:test'
import {
	matchesPlayer,
	pickBusName,
	playerIdFromBusName,
	snapshotFromProperties,
	trackLabel,
} from './mpris'

describe('playerIdFromBusName', () => {
	test('returns the stable id for plain and instance-suffixed names', () => {
		expect(playerIdFromBusName('org.mpris.MediaPlayer2.rhythmbox')).toBe(
			'rhythmbox',
		)
		expect(
			playerIdFromBusName('org.mpris.MediaPlayer2.firefox.instance_1_42'),
		).toBe('firefox')
		expect(playerIdFromBusName('org.mpris.MediaPlayer2.vlc.instance7389')).toBe(
			'vlc',
		)
	})

	test('ignores names outside the MPRIS namespace', () => {
		expect(playerIdFromBusName('org.gnome.Shell')).toBeNull()
		expect(playerIdFromBusName('org.mpris.MediaPlayer2.')).toBeNull()
	})
})

describe('matchesPlayer', () => {
	test('does not confuse players sharing a prefix', () => {
		expect(matchesPlayer('org.mpris.MediaPlayer2.chromium', 'chrome')).toBe(
			false,
		)
		expect(
			matchesPlayer('org.mpris.MediaPlayer2.chromium.instance9', 'chromium'),
		).toBe(true)
	})
})

describe('pickBusName', () => {
	test('prefers the exact name over instances', () => {
		expect(
			pickBusName(
				['org.mpris.MediaPlayer2.vlc.instance1', 'org.mpris.MediaPlayer2.vlc'],
				'vlc',
			),
		).toBe('org.mpris.MediaPlayer2.vlc')
	})

	test('falls back to the first instance or null', () => {
		expect(
			pickBusName(['org.mpris.MediaPlayer2.firefox.instance_1_2'], 'firefox'),
		).toBe('org.mpris.MediaPlayer2.firefox.instance_1_2')
		expect(pickBusName(['org.mpris.MediaPlayer2.vlc'], 'rhythmbox')).toBeNull()
	})
})

describe('snapshotFromProperties', () => {
	test('reads status, track, and capabilities', () => {
		const snapshot = snapshotFromProperties({
			PlaybackStatus: 'Playing',
			Metadata: { 'xesam:title': 'Song', 'xesam:artist': ['A', 'B'] },
			CanPause: true,
			CanGoNext: true,
			CanGoPrevious: false,
		})
		expect(snapshot).toEqual({
			status: 'playing',
			title: 'Song',
			artist: 'A, B',
			canPlayPause: true,
			canGoNext: true,
			canGoPrevious: false,
		})
		expect(trackLabel(snapshot)).toBe('Song — A, B')
	})

	test('treats missing capabilities as allowed and unknown status as stopped', () => {
		expect(snapshotFromProperties({})).toEqual({
			status: 'stopped',
			title: '',
			artist: '',
			canPlayPause: true,
			canGoNext: true,
			canGoPrevious: true,
		})
	})

	test('uses CanPlay when paused and CanPause when playing', () => {
		expect(
			snapshotFromProperties({ PlaybackStatus: 'Paused', CanPlay: false })
				.canPlayPause,
		).toBe(false)
		expect(
			snapshotFromProperties({ PlaybackStatus: 'Playing', CanPlay: false })
				.canPlayPause,
		).toBe(true)
	})

	test('disables every control when CanControl is false', () => {
		const snapshot = snapshotFromProperties({ CanControl: false })
		expect(snapshot.canPlayPause).toBe(false)
		expect(snapshot.canGoNext).toBe(false)
		expect(snapshot.canGoPrevious).toBe(false)
	})
})
