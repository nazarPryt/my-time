import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { parseWebEnv } from './src/shared/config/web-env.ts'

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
		resolve: {
			alias: {
				'@': path.resolve(import.meta.dirname, './src'),
			},
		},
	}
})
