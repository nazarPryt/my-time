import path from 'node:path'
import { defineConfig } from 'wxt'
// Direct file import (not the `contracts` barrel) keeps zod out of the config.
import { EXTENSION_VERSION } from '../../contracts/src/features/site-blocking/extension-version'

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	srcDir: 'src',
	vite: () => ({
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	}),
	manifest: {
		name: 'my·time',
		version: EXTENSION_VERSION,
		description: 'Blocks distracting sites from your my·time block list.',
		permissions: [
			'declarativeNetRequest',
			'declarativeNetRequestWithHostAccess',
			'storage',
		],
		host_permissions: ['<all_urls>'],
		web_accessible_resources: [
			{
				resources: ['block.html'],
				matches: ['<all_urls>'],
			},
		],
	},
})
