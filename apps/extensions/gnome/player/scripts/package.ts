import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { ARCHIVE_NAME } from './extension-uuid'

const root = path.resolve(import.meta.dir, '..')
const output = path.join(root, 'build')
await mkdir(output, { recursive: true })
const pack = Bun.spawn(
	[
		'gnome-extensions',
		'pack',
		'--force',
		`--out-dir=${output}`,
		path.join(root, 'dist'),
	],
	{ stdout: 'inherit', stderr: 'inherit' },
)
if (await pack.exited) throw new Error('Unable to package GNOME extension')
console.info(`Extension zip: ${path.join(output, ARCHIVE_NAME)}`)
