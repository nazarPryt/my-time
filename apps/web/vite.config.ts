import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { parseWebEnv } from './src/shared/config/web-env.ts'

/**
 * Micro frontends are served from the host's own origin under /remotes/<name>/.
 * Locally that path is proxied to each remote's dev server; in production the
 * web nginx container proxies it to the remote's container (nginx.conf).
 * Same URL in every environment, and no CORS.
 */
const REMOTE_PROXIES = {
	'/remotes/english-quiz': { target: 'http://localhost:5174', ws: true },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	parseWebEnv(loadEnv(mode, import.meta.dirname, 'VITE_'))
	return {
		plugins: [
			tanstackRouter({
				target: 'react',
				autoCodeSplitting: true,
				routesDirectory: './src/app/routes',
				generatedRouteTree: './src/app/routeTree.gen.ts',
			}),
			react(),
			tailwindcss(),
		],
		server: { proxy: REMOTE_PROXIES },
		preview: { proxy: REMOTE_PROXIES },
		resolve: {
			alias: {
				'@': path.resolve(import.meta.dirname, './src'),
			},
		},
	}
})
