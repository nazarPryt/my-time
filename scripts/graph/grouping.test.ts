import { expect, test } from 'bun:test'
import path from 'node:path'
import { chainForFile } from './grouping'

const ROOT = path.resolve(import.meta.dir, '../..')

test('web feature file → web app + web/auth feature + file chain', () => {
	const filePath = path.join(
		ROOT,
		'apps/web/src/features/auth/login/useLogin.ts',
	)
	const chain = chainForFile(filePath, ROOT)
	expect(chain?.app).toEqual({
		id: 'web',
		label: 'web',
		app: 'web',
		type: 'app',
	})
	expect(chain?.feature).toEqual({
		id: 'web/auth',
		label: 'auth',
		app: 'web',
		type: 'feature',
		parent: 'web',
	})
	expect(chain?.file).toEqual({
		id: 'web/auth/login/useLogin',
		label: 'login/useLogin',
		app: 'web',
		type: 'file',
		parent: 'web/auth',
	})
})

test('web shared file → web/shared feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'apps/web/src/shared/lib/api.ts'),
		ROOT,
	)
	expect(chain?.feature.id).toBe('web/shared')
	expect(chain?.file.id).toBe('web/shared/lib/api')
	expect(chain?.app.id).toBe('web')
})

test('web root file → web/(root) feature', () => {
	const chain = chainForFile(path.join(ROOT, 'apps/web/src/main.tsx'), ROOT)
	expect(chain?.feature.id).toBe('web/(root)')
	expect(chain?.file.id).toBe('web/(root)/main')
})

test('api feature file → api/<name> feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'apps/api/src/features/auth/routes.ts'),
		ROOT,
	)
	expect(chain?.feature).toEqual({
		id: 'api/auth',
		label: 'auth',
		app: 'api',
		type: 'feature',
		parent: 'api',
	})
})

test('api db file → api/db feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'apps/api/src/db/schema/users.ts'),
		ROOT,
	)
	expect(chain?.feature.id).toBe('api/db')
	expect(chain?.file.id).toBe('api/db/schema/users')
})

test('extension feature file → extension/<name> feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'apps/extension/src/features/auth/index.ts'),
		ROOT,
	)
	expect(chain?.feature.id).toBe('extension/auth')
	expect(chain?.app.id).toBe('extension')
})

test('mobile feature file (singular "feature") → mobile/<name> feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'apps/mobile/feature/workout/store.ts'),
		ROOT,
	)
	expect(chain?.app.id).toBe('mobile')
	expect(chain?.feature.id).toBe('mobile/workout')
})

test('contracts feature file → contracts/<name> feature', () => {
	const chain = chainForFile(
		path.join(ROOT, 'contracts/src/features/auth/schema.ts'),
		ROOT,
	)
	expect(chain?.app.id).toBe('contracts')
	expect(chain?.feature.id).toBe('contracts/auth')
})

test('contracts root file → contracts/(root) feature', () => {
	const chain = chainForFile(path.join(ROOT, 'contracts/src/index.ts'), ROOT)
	expect(chain?.feature.id).toBe('contracts/(root)')
})

test('packages file → each package is its own group', () => {
	const chain = chainForFile(
		path.join(ROOT, 'packages/features/src/workout/store.ts'),
		ROOT,
	)
	expect(chain?.app).toEqual({
		id: 'packages/features',
		label: 'features',
		app: 'packages/features',
		type: 'app',
	})
	expect(chain?.feature.id).toBe('packages/features/workout')
})

test('unknown file → null', () => {
	const chain = chainForFile(path.join(ROOT, 'some/random/file.ts'), ROOT)
	expect(chain).toBeNull()
})
