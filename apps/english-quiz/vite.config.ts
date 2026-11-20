import { federation } from '@module-federation/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/**
 * Public path the remote is served from. The host proxies this path to the
 * remote's own server (Vite in dev, the english-quiz nginx container in prod),
 * so the browser sees one origin: no CORS, no extra domain, same URL in every
 * environment.
 */
const BASE_PATH = '/remotes/english-quiz/'
const PORT = 5174

export default defineConfig({
	base: BASE_PATH,
	plugins: [
		vue(),
		federation({
			// Container name the host addresses (ENGLISH_QUIZ_REMOTE.name).
			name: 'englishQuiz',
			filename: 'remoteEntry.js',
			// mf-manifest.json describes the entry + every chunk; the host loads
			// it so it can preload assets and never hardcodes hashed filenames.
			manifest: true,
			exposes: {
				'./mount': './src/mount.ts',
			},
			// Nothing to share: the host is React, this remote bundles its own Vue.
			shared: {},
			dts: false,
		}),
	],
	server: { port: PORT, strictPort: true },
	preview: { port: PORT, strictPort: true },
	build: { target: 'es2022' },
})
