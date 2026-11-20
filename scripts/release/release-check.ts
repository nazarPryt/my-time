// CI gate for PRs into main: the version must be bumped and have notes.
// Usage: bun run release:check <base-ref>   (e.g. origin/main)
import {
	compareVersions,
	RELEASE_NOTES,
} from '../../contracts/src/features/releases'
import { git } from './git'
import { readProductVersion } from './paths'

const baseRef = process.argv[2]
if (!baseRef) {
	console.error('Usage: bun run release:check <base-ref>')
	process.exit(1)
}

const version = await readProductVersion()
const baseVersion = (
	JSON.parse(git('show', `${baseRef}:package.json`)) as { version: string }
).version

const errors: string[] = []
if (compareVersions(version, baseVersion) <= 0) {
	errors.push(
		`Version ${version} is not newer than ${baseRef} (${baseVersion}). Run \`bun run release\` on dev.`,
	)
}
if (RELEASE_NOTES[0]?.version !== version) {
	errors.push(
		`The newest entry in release-notes.data.ts must be ${version} (found ${RELEASE_NOTES[0]?.version ?? 'none'}).`,
	)
}

if (errors.length) {
	for (const error of errors) console.error(`✗ ${error}`)
	process.exit(1)
}
console.info(`✓ Releasing ${baseVersion} → ${version}`)
