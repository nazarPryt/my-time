import { expect, test } from 'bun:test'
import path from 'node:path'
import { fileNodeForFile, nodeForFile } from './grouping'

const ROOT = path.resolve(import.meta.dir, '../..')

test('web feature file → web/<name> feature node', () => {
	const filePath = path.join(ROOT, 'apps/web/src/feature/auth/useLogin.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'web/auth',
		label: 'auth',
		app: 'web',
		type: 'feature',
	})
})

test('web feature file → file node via fileNodeForFile', () => {
	const filePath = path.join(ROOT, 'apps/web/src/feature/auth/useLogin.ts')
	const node = fileNodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'web/auth/useLogin',
		label: 'useLogin',
		app: 'web',
		type: 'file',
		parent: 'web/auth',
	})
})

test('web shared file → web/shared feature node', () => {
	const filePath = path.join(ROOT, 'apps/web/src/shared/lib/api.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'web/shared',
		label: 'shared',
		app: 'web',
		type: 'feature',
	})
})

test('api feature file → api/<name> feature node', () => {
	const filePath = path.join(ROOT, 'apps/api/src/features/auth/routes.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'api/auth',
		label: 'auth',
		app: 'api',
		type: 'feature',
	})
})

test('api db file → api/db feature node', () => {
	const filePath = path.join(ROOT, 'apps/api/src/db/schema/users.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'api/db',
		label: 'db',
		app: 'api',
		type: 'feature',
	})
})

test('contracts feature file → contracts/<name> package node', () => {
	const filePath = path.join(ROOT, 'contracts/src/features/auth/schema.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'contracts/auth',
		label: 'auth',
		app: null,
		type: 'package',
	})
})

test('packages/features file → packages/features package node', () => {
	const filePath = path.join(ROOT, 'packages/features/src/workout/store.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'packages/features',
		label: 'features',
		app: null,
		type: 'package',
	})
})

test('extension feature file → extension/<name> feature node', () => {
	const filePath = path.join(ROOT, 'apps/extension/src/features/auth/index.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'extension/auth',
		label: 'auth',
		app: 'extension',
		type: 'feature',
	})
})

test('contracts root file → contracts package node', () => {
	const filePath = path.join(ROOT, 'contracts/src/index.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toEqual({
		id: 'contracts',
		label: 'contracts',
		app: null,
		type: 'package',
	})
})

test('fileNodeForFile returns null for non-feature file (shared)', () => {
	const filePath = path.join(ROOT, 'apps/web/src/shared/lib/api.ts')
	const node = fileNodeForFile(filePath, ROOT)
	expect(node).toBeNull()
})

test('unknown file → null', () => {
	const filePath = path.join(ROOT, 'some/random/file.ts')
	const node = nodeForFile(filePath, ROOT)
	expect(node).toBeNull()
})
