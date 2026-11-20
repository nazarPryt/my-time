import { z } from 'zod'

export const VersionSchema = z
	.string()
	.regex(/^\d+\.\d+\.\d+$/, 'Expected a MAJOR.MINOR.PATCH version')

export type Version = z.infer<typeof VersionSchema>

/** Negative when `a` is older than `b`, positive when newer, 0 when equal. */
export function compareVersions(a: Version, b: Version): number {
	const left = a.split('.').map(Number)
	const right = b.split('.').map(Number)
	for (let i = 0; i < 3; i++) {
		const diff = (left[i] ?? 0) - (right[i] ?? 0)
		if (diff !== 0) return diff
	}
	return 0
}
