import {
	compareVersions,
	type ReleaseNote,
	type Version,
} from '../../contracts/src/features/releases'

export type Bump = 'major' | 'minor' | 'patch'

export type Commit = {
	subject: string
	body: string
	parents: string[]
}

type ConventionalCommit = {
	type: string
	breaking: boolean
	description: string
}

const CONVENTIONAL =
	/^(?<type>[a-z]+)(?:\([^)]*\))?(?<breaking>!)?:\s*(?<description>.+)$/i
const GENERIC_MERGE = /^Merge (pull request|branch|remote-tracking branch) /

export function parseConventional(subject: string): ConventionalCommit | null {
	const match = CONVENTIONAL.exec(subject.trim())
	if (!match?.groups) return null
	return {
		type: (match.groups.type ?? '').toLowerCase(),
		breaking: Boolean(match.groups.breaking),
		description: match.groups.description ?? '',
	}
}

const BUMP_ORDER: Bump[] = ['patch', 'minor', 'major']

/** Highest bump the commits ask for, or null when they're all chores. */
export function bumpFor(commits: Commit[]): Bump | null {
	let bump: Bump | null = null
	const raise = (next: Bump) => {
		if (!bump || BUMP_ORDER.indexOf(next) > BUMP_ORDER.indexOf(bump)) {
			bump = next
		}
	}
	for (const commit of commits) {
		const parsed = parseConventional(commit.subject)
		if (parsed?.breaking || /^BREAKING[ -]CHANGE:/m.test(commit.body)) {
			raise('major')
		} else if (parsed?.type === 'feat') {
			raise('minor')
		} else if (parsed?.type === 'fix' || parsed?.type === 'perf') {
			raise('patch')
		}
	}
	return bump
}

export function nextVersion(current: Version, bump: Bump): Version {
	const [major = 0, minor = 0, patch = 0] = current.split('.').map(Number)
	if (bump === 'major') return `${major + 1}.0.0`
	if (bump === 'minor') return `${major}.${minor + 1}.0`
	return `${major}.${minor}.${patch + 1}`
}

function toSentence(text: string) {
	const trimmed = text.replace(/\s*\(#\d+\)$/, '').trim()
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

/**
 * Draft notes from first-parent history of dev: a merge titled as a
 * Conventional Commit (`git merge --no-ff -m "feat: …"`) becomes one item; a
 * default "Merge branch 'x'" is expanded into the feat/fix commits it brought
 * in; commits made or fast-forwarded onto dev count one by one.
 */
export function draftNoteItems(
	firstParentCommits: Commit[],
	commitsMergedBy: (merge: Commit) => Commit[],
): Pick<ReleaseNote, 'features' | 'fixes'> {
	const features = new Set<string>()
	const fixes = new Set<string>()
	const add = (title: string) => {
		const parsed = parseConventional(title)
		if (parsed?.type === 'feat') features.add(toSentence(parsed.description))
		else if (parsed?.type === 'fix' || parsed?.type === 'perf') {
			fixes.add(toSentence(parsed.description))
		}
	}
	for (const commit of firstParentCommits) {
		const isMerge = commit.parents.length > 1
		if (!isMerge) {
			add(commit.subject)
			continue
		}
		// GitHub's default merge message keeps the PR title in the body.
		const title = GENERIC_MERGE.test(commit.subject)
			? (commit.body.split('\n')[0]?.trim() ?? '')
			: commit.subject
		if (parseConventional(title)) add(title)
		else for (const merged of commitsMergedBy(commit)) add(merged.subject)
	}
	return { features: [...features], fixes: [...fixes] }
}

export function renderNotesFile(notes: ReleaseNote[]): string {
	const sorted = [...notes].sort((a, b) =>
		compareVersions(b.version, a.version),
	)
	return `// Written by \`bun run release\`; edit the wording by hand before committing.
// Newest release first.
import type { ReleaseNote } from './release-note'

export const RELEASE_NOTES: ReleaseNote[] = ${JSON.stringify(sorted, null, '\t')}
`
}

export function renderMarkdown(note: ReleaseNote): string {
	const sections: string[] = []
	if (note.features.length) {
		sections.push(
			`## New\n\n${note.features.map((item) => `- ${item}`).join('\n')}`,
		)
	}
	if (note.fixes.length) {
		sections.push(
			`## Fixed\n\n${note.fixes.map((item) => `- ${item}`).join('\n')}`,
		)
	}
	return sections.length
		? `${sections.join('\n\n')}\n`
		: 'Maintenance release.\n'
}
