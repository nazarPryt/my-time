import { resolve } from 'node:path'

export const ROOT = resolve(import.meta.dir, '../..')
export const PACKAGE_JSON = resolve(ROOT, 'package.json')
export const NOTES_FILE = resolve(
	ROOT,
	'contracts/src/features/releases/release-notes.data.ts',
)

export async function readProductVersion(): Promise<string> {
	const pkg = (await Bun.file(PACKAGE_JSON).json()) as { version: string }
	return pkg.version
}
