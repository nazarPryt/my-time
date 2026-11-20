import { expect, test } from 'bun:test'
import { configureSchema } from './build-settings'

const schema = await Bun.file(
	`${import.meta.dir}/../schemas/org.gnome.shell.extensions.my-time.gschema.xml`,
).text()

test('development defaults remain local', () => {
	expect(configureSchema(schema, {})).toBe(schema)
})

test('production URLs replace both defaults and normalize the API prefix', () => {
	const result = configureSchema(schema, {
		VITE_API_URL: 'https://api.example.com/api/v1/',
		FRONTEND_WEB_URL: 'https://example.com/',
	})
	expect(result).toContain(
		"<default>'https://api.example.com/api/v1'</default>",
	)
	expect(result).toContain("<default>'https://example.com'</default>")
	expect(result).not.toContain('localhost')
})

test('invalid hosted HTTP URLs fail the build', () => {
	expect(() =>
		configureSchema(schema, { VITE_API_URL: 'http://api.example.com' }),
	).toThrow('HTTPS')
})
