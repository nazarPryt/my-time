import { expect, test } from 'bun:test'
import { chainForFile } from './grouping'

const WORKSPACES = ['apps/web', 'apps/mobile', 'apps/extensions/gnome/player']

test('workspace file under src/features → workspace + feature + file chain', () => {
	const chain = chainForFile(
		'apps/web/src/features/auth/login/use-login.ts',
		WORKSPACES,
	)
	expect(chain.app).toEqual({
		id: 'apps/web',
		label: 'apps/web',
		app: 'apps/web',
		type: 'app',
	})
	expect(chain.feature).toEqual({
		id: 'apps/web::auth',
		label: 'auth',
		app: 'apps/web',
		type: 'feature',
		parent: 'apps/web',
	})
	expect(chain.file).toEqual({
		id: 'apps/web::auth::login/use-login',
		label: 'login/use-login',
		app: 'apps/web',
		type: 'file',
		parent: 'apps/web::auth',
	})
})

test('first folder under src/ is the module', () => {
	const chain = chainForFile('apps/web/src/shared/lib/api.ts', WORKSPACES)
	expect(chain.feature.id).toBe('apps/web::shared')
	expect(chain.file.label).toBe('lib/api')
})

test('files directly in the workspace or src/ go to the (root) module', () => {
	expect(chainForFile('apps/web/src/main.tsx', WORKSPACES).feature.id).toBe(
		'apps/web::(root)',
	)
	expect(chainForFile('apps/web/vite.config.ts', WORKSPACES).file.id).toBe(
		'apps/web::(root)::vite.config',
	)
})

test('singular feature/ folder is unwrapped too (mobile)', () => {
	const chain = chainForFile('apps/mobile/feature/auth/login.tsx', WORKSPACES)
	expect(chain.feature.id).toBe('apps/mobile::auth')
})

test('deepest workspace wins for nested packages', () => {
	const chain = chainForFile(
		'apps/extensions/gnome/player/src/extension.ts',
		WORKSPACES,
	)
	expect(chain.app.id).toBe('apps/extensions/gnome/player')
	expect(chain.feature.id).toBe('apps/extensions/gnome/player::(root)')
})

test('files outside workspaces are grouped by top-level folder', () => {
	const chain = chainForFile('scripts/graph/parser.ts', WORKSPACES)
	expect(chain.app.id).toBe('scripts')
	expect(chain.feature.id).toBe('scripts::graph')
	expect(chainForFile('vitest.config.ts', WORKSPACES).app.id).toBe('(root)')
})

test('a vue file keeps its name without the extension', () => {
	const chain = chainForFile('apps/english-quiz/src/hub/practice-hub.vue', [
		'apps/english-quiz',
	])
	expect(chain.file.id).toBe('apps/english-quiz::hub::practice-hub')
})
