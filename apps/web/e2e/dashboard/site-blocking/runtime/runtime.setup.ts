import { execFileSync } from 'node:child_process'
import { API_PREFIX } from 'contracts'
import { RUNTIME_ORIGIN } from './runtime.mocks'

export default async function setup() {
	execFileSync('bun', ['--bun', 'wxt', 'build'], {
		cwd: '../extension',
		stdio: 'inherit',
		env: {
			...process.env,
			VITE_API_URL: `${RUNTIME_ORIGIN}${API_PREFIX}`,
			VITE_WEB_URL: RUNTIME_ORIGIN,
		},
	})
}
