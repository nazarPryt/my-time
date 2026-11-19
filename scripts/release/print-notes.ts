// Prints a version's release notes as Markdown for the GitHub Release body.
// Usage: bun scripts/release/print-notes.ts <version>
import { RELEASE_NOTES } from '../../contracts/src/features/releases'
import { renderMarkdown } from './release-lib'

const version = process.argv[2]
const note = RELEASE_NOTES.find((entry) => entry.version === version)
if (!note) {
	console.error(`No release notes for ${version}`)
	process.exit(1)
}
process.stdout.write(renderMarkdown(note))
