import path from 'node:path'
import { defineConfig } from 'wxt'

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
