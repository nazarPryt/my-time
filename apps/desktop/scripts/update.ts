import path from 'node:path'

const root = path.resolve(import.meta.dir, '../../..')
const args = process.argv.slice(2)
if (args.some((argument) => argument !== '--skip-install')) {
	console.error('Usage: bun run desktop:update [--skip-install]')
	process.exit(1)
}

const steps = [
	{ label: 'Desktop tests', command: ['bun', '--filter', 'desktop', 'test'] },
	{
		label: 'Desktop build and typecheck',
		command: ['bun', 'run', 'desktop:build'],
	},
	{ label: 'Repository lint', command: ['bun', 'run', 'lint:check'] },
	{
		label: 'Package extension',
		command: ['bun', 'apps/desktop/scripts/package.ts'],
	},
]
if (!args.includes('--skip-install')) {
	steps.push({
		label: 'Install extension',
		command: ['bun', 'apps/desktop/scripts/install.ts'],
	})
}

for (const step of steps) {
	console.info(`\n${step.label}`)
	const child = Bun.spawn(step.command, {
		cwd: root,
		stdin: 'inherit',
		stdout: 'inherit',
		stderr: 'inherit',
	})
	const code = await child.exited
	if (code !== 0) {
		console.error(`${step.label} failed. Remaining steps were skipped.`)
		process.exit(code)
	}
}

console.info(
	args.includes('--skip-install')
		? 'Checks passed and extension packaged. Installation skipped.'
		: 'Update installed. Reload GNOME: on Wayland, log out and back in; on Xorg, press Alt+F2 and enter r.',
)
