import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { configureSchema } from './build-settings'

const root = path.resolve(import.meta.dir, '..')
const output = path.join(root, 'dist')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })

const result = await Bun.build({
	entrypoints: [
		path.join(root, 'src/extension.ts'),
		path.join(root, 'src/prefs.ts'),
	],
	outdir: output,
	naming: '[name].js',
	target: 'browser',
	format: 'esm',
	external: ['gi://*', 'resource://*'],
})
if (!result.success)
	throw new AggregateError(result.logs, 'Desktop build failed')
for (const name of ['metadata.json', 'stylesheet.css', 'schemas']) {
	await cp(path.join(root, name), path.join(output, name), { recursive: true })
}
// Read the web's local env files; explicit build environment takes precedence.
const localEnv: Record<string, string> = {}
for (const name of ['.env', '.env.local']) {
	const file = Bun.file(path.resolve(root, '../web', name))
	if (await file.exists()) Object.assign(localEnv, parseEnv(await file.text()))
}
const schemaPath = path.join(
	output,
	'schemas/org.gnome.shell.extensions.my-time.gschema.xml',
)
await writeFile(
	schemaPath,
	configureSchema(await readFile(schemaPath, 'utf8'), {
		...localEnv,
		...process.env,
	}),
)
const compile = Bun.spawn(
	['glib-compile-schemas', '--strict', path.join(output, 'schemas')],
	{ stdout: 'inherit', stderr: 'inherit' },
)
if (await compile.exited) throw new Error('Unable to compile GNOME settings')
console.info(`Built GNOME extension in ${output}`)
