import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

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
const compile = Bun.spawn(
	['glib-compile-schemas', '--strict', path.join(output, 'schemas')],
	{ stdout: 'inherit', stderr: 'inherit' },
)
if (await compile.exited) throw new Error('Unable to compile GNOME settings')
console.info(`Built GNOME extension in ${output}`)
