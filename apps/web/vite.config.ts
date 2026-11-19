import { readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { parseWebEnv } from './src/shared/config/web-env.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	parseWebEnv(loadEnv(mode, import.meta.dirname, 'VITE_'))
	// The root package.json holds the product version that `bun run release` bumps.
	const { version } = JSON.parse(
		readFileSync(
			path.resolve(import.meta.dirname, '../../package.json'),
			'utf8',
		),
	) as { version: string }
	return {
		define: { __APP_VERSION__: JSON.stringify(version) },
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
		resolve: {
			alias: {
				'@': path.resolve(import.meta.dirname, './src'),
			},
		},
	}
})
