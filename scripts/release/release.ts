// Prepares a release on dev: bumps the root version and drafts release notes.
// Usage: bun run release [major|minor|patch|x.y.z] [--dry-run]
import {
	RELEASE_NOTES,
	type ReleaseNote,
	VersionSchema,
} from '../../contracts/src/features/releases'
import { commitsInRange, commitsMergedBy, git, tagExists } from './git'
import { NOTES_FILE, PACKAGE_JSON, ROOT, readProductVersion } from './paths'
import {
	type Bump,
	bumpFor,
	draftNoteItems,
	nextVersion,
	renderNotesFile,
} from './release-lib'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const override = args.find((arg) => !arg.startsWith('--'))

function fail(message: string): never {
	console.error(`✗ ${message}`)
	process.exit(1)
}

if (override && !['major', 'minor', 'patch'].includes(override)) {
	if (!VersionSchema.safeParse(override).success) {
		fail(`Unknown argument "${override}". Use major, minor, patch or x.y.z.`)
	}
}

if (!dryRun && git('status', '--porcelain', '--untracked-files=no')) {
	fail('Commit or stash your changes first.')
}

// Release tags are created on main by CI; make sure we can see them.
Bun.spawnSync(['git', 'fetch', '--tags', '--quiet'])

const current = await readProductVersion()
const baseTag = `v${current}`
if (!tagExists(baseTag)) {
	fail(
		`Tag ${baseTag} (the current version) does not exist. Was the last release merged to main?`,
	)
}

const commits = commitsInRange(`${baseTag}..HEAD`)
if (commits.length === 0) fail(`Nothing to release since ${baseTag}.`)

const detected = bumpFor(commits)
const next =
	override && !['major', 'minor', 'patch'].includes(override)
		? override
		: nextVersion(
				current,
				(override as Bump | undefined) ?? detected ?? 'patch',
			)

if (RELEASE_NOTES.some((note) => note.version === next)) {
	fail(`Release notes for ${next} already exist.`)
}

const today = Bun.spawnSync(['date', '+%F']).stdout.toString().trim()
const note: ReleaseNote = {
	version: next,
	date: today,
	...draftNoteItems(
		commitsInRange(`${baseTag}..HEAD`, { firstParent: true }),
		commitsMergedBy,
	),
}

console.info(`${commits.length} commits since ${baseTag}`)
console.info(
	`Version: ${current} → ${next}${override ? ' (manual)' : ` (${detected ?? 'no feat/fix, patch'})`}`,
)
console.info(JSON.stringify(note, null, 2))

if (dryRun) process.exit(0)

await Bun.write(NOTES_FILE, renderNotesFile([note, ...RELEASE_NOTES]))
const pkg = await Bun.file(PACKAGE_JSON).text()
await Bun.write(
	PACKAGE_JSON,
	pkg.replace(/"version":\s*"[^"]+"/, `"version": "${next}"`),
)
Bun.spawnSync(['bunx', 'biome', 'format', '--write', NOTES_FILE], { cwd: ROOT })

console.info(`
Next steps:
  1. Reword the draft notes for users: contracts/src/features/releases/release-notes.data.ts
  2. git commit -am "chore(release): v${next}"
  3. bun run ci:local, push, then open the PR dev → main.
     CI tags v${next} and publishes the GitHub Release after the merge.`)
