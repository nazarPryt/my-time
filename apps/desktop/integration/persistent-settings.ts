import type Gio from 'gi://Gio'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { GSettingsStore } from '../src/dal/settings-store'

const SCHEMA = 'org.gnome.shell.extensions.my-time'

/** Real GSettings with a keyfile backend isolated from the user's dconf profile. */
export function persistentSettings(directory: string): GSettingsStore {
	const schemas = join(directory, 'schemas')
	mkdirSync(schemas, { recursive: true })
	copyFileSync(
		resolve(import.meta.dir, '../schemas', `${SCHEMA}.gschema.xml`),
		join(schemas, `${SCHEMA}.gschema.xml`),
	)
	const env = {
		...process.env,
		GSETTINGS_BACKEND: 'keyfile',
		XDG_CONFIG_HOME: directory,
		GSETTINGS_SCHEMA_DIR: schemas,
	}
	function run(command: string, args: string[]): string {
		const result = spawnSync(command, args, { env, encoding: 'utf8' })
		if (result.error) throw result.error
		if (result.status !== 0)
			throw new Error(`${command} failed: ${result.stderr}`)
		return result.stdout.trim()
	}
	run('glib-compile-schemas', [schemas])
	const native = {
		get_string(key: string): string {
			const value = run('gsettings', ['get', SCHEMA, key])
			// GVariant prints strings in single or double quotes. Journal values
			// contain ASCII IDs, URLs and ISO timestamps; preserve escaped slashes.
			return value.startsWith("'")
				? value.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\')
				: JSON.parse(value)
		},
		set_string(key: string, value: string): boolean {
			run('gsettings', ['set', SCHEMA, key, JSON.stringify(value)])
			return true
		},
		apply() {},
	}
	return new GSettingsStore(native as unknown as Gio.Settings)
}
