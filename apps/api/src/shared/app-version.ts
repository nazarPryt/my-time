import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'

// The root package.json holds the product version (`bun run release`); it sits
// outside rootDir, so it is read at runtime instead of imported.
function readAppVersion(): string {
	try {
		const file = resolve(import.meta.dir, '../../../../package.json')
		const parsed = z
			.object({ version: z.string() })
			.safeParse(JSON.parse(readFileSync(file, 'utf8')))
		return parsed.success ? parsed.data.version : 'unknown'
	} catch {
		return 'unknown'
	}
}

export const APP_VERSION = readAppVersion()
