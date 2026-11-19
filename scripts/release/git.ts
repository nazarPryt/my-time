import type { Commit } from './release-lib'

export function git(...args: string[]) {
	const result = Bun.spawnSync(['git', ...args], {
		stdout: 'pipe',
		stderr: 'pipe',
	})
	if (result.exitCode !== 0) {
		throw new Error(`git ${args.join(' ')} failed:\n${result.stderr}`)
	}
	return result.stdout.toString().trim()
}

export function tagExists(tag: string) {
	return (
		Bun.spawnSync(['git', 'rev-parse', '-q', '--verify', `refs/tags/${tag}`])
			.exitCode === 0
	)
}

const FIELD = '\x1f'
const RECORD = '\x1e'

export function commitsInRange(
	range: string,
	options: { firstParent?: boolean; noMerges?: boolean } = {},
): Commit[] {
	const output = git(
		'log',
		...(options.firstParent ? ['--first-parent'] : []),
		...(options.noMerges ? ['--no-merges'] : []),
		`--format=%s${FIELD}%b${FIELD}%P${RECORD}`,
		range,
	)
	return output
		.split(RECORD)
		.map((record) => record.trim())
		.filter(Boolean)
		.map((record) => {
			const [subject = '', body = '', parents = ''] = record.split(FIELD)
			return {
				subject,
				body: body.trim(),
				parents: parents.trim().split(' ').filter(Boolean),
			}
		})
}

/** Commits a merge brought in: reachable from its second parent, not its first. */
export function commitsMergedBy(merge: Commit): Commit[] {
	const [base, merged] = merge.parents
	if (!base || !merged) return []
	return commitsInRange(`${base}..${merged}`, { noMerges: true })
}
