import { resolve } from 'node:path'
import type { StepState } from '../shared/step-runner'
import { CI_COMPOSE_PROJECT } from './ci-local-lib'

export interface Step {
	name: string
	command: string[]
	cwd: string
	startsDatabase?: boolean
}

export function testCompose(project: string) {
	return ['docker', 'compose', '-p', project, '-f', 'docker-compose.test.yml']
}

export function buildSteps({
	root,
	worktree,
	branch,
}: {
	root: string
	worktree: string
	branch: string
}): Step[] {
	const inTree = (name: string, command: string[], dir = ''): Step => ({
		name,
		command,
		cwd: resolve(worktree, dir),
	})
	const steps: Step[] = [
		{
			name: 'Create worktree at HEAD',
			command: ['git', 'worktree', 'add', '--detach', worktree, 'HEAD'],
			cwd: root,
		},
		inTree('Install dependencies', ['bun', 'install', '--frozen-lockfile']),
		inTree('Lint', ['bun', 'run', 'lint:check']),
		inTree('Typecheck api', ['bun', '--filter', 'api', 'typecheck']),
		inTree('Typecheck web', ['bun', '--filter', 'web', 'typecheck']),
		inTree('Typecheck web E2E', ['bun', '--filter', 'web', 'typecheck:e2e']),
		inTree('Typecheck english-quiz', [
			'bun',
			'--filter',
			'english-quiz',
			'typecheck',
		]),
		inTree('Typecheck GNOME time tracker', [
			'bun',
			'--filter',
			'gnome-time-tracker',
			'typecheck',
		]),
		inTree('Typecheck GNOME integration', [
			'bun',
			'--filter',
			'gnome-time-tracker',
			'typecheck:integration',
		]),
		inTree('Typecheck GNOME player', [
			'bun',
			'--filter',
			'gnome-player',
			'typecheck',
		]),
		inTree('Compile extension', ['bun', '--filter', 'extension', 'compile']),
		inTree(
			'Build extension',
			['bun', '--bun', 'wxt', 'build'],
			'apps/extensions/browser',
		),
		{
			// A separate project/database prevents API tests from clearing dev data.
			...inTree('Start API-test database', [
				...testCompose(CI_COMPOSE_PROJECT),
				'up',
				'-d',
				'--wait',
			]),
			startsDatabase: true,
		},
		inTree('API tests', ['bun', '--filter', 'api', 'test']),
		inTree('Web unit tests', ['bun', '--filter', 'web', 'test']),
		inTree('Session-sync tests', [
			'bun',
			'--filter',
			'@my-time/session-sync',
			'test',
		]),
		inTree('English-quiz tests', ['bun', '--filter', 'english-quiz', 'test']),
		inTree('Contracts tests', [
			'bun',
			'--filter',
			'@my-time/contracts',
			'test',
		]),
		inTree('Script tests', ['bun', 'run', 'test:scripts']),
		inTree('GNOME time tracker tests', [
			'bun',
			'--filter',
			'gnome-time-tracker',
			'test',
		]),
		inTree('GNOME player tests', ['bun', '--filter', 'gnome-player', 'test']),
		inTree('Web E2E', ['bun', '--filter', 'web', 'test:e2e']),
		inTree('Extension E2E', ['bun', 'run', 'test:web:e2e:extension']),
		inTree('Cross-client integration E2E', [
			'bun',
			'run',
			'test:web:e2e:integration',
		]),
		inTree('Build web', ['bun', '--filter', 'web', 'build']),
		inTree('Build english-quiz', ['bun', '--filter', 'english-quiz', 'build']),
		inTree('Check observability config', ['bun', 'run', 'check:observability']),
		inTree('Build Docker images', [
			'env',
			'FRONTEND_WEB_URL=http://localhost:5173',
			'docker',
			'compose',
			'-p',
			CI_COMPOSE_PROJECT,
			'-f',
			'docker-compose.prod.yml',
			'build',
		]),
		// Only dangling images; the build cache is pruned by hand (`bun run docker:prune`).
		inTree('Prune dangling images', ['docker', 'image', 'prune', '-f']),
	]
	// dev is the branch PR'd into main, where CI also checks the release version.
	if (branch === 'dev') {
		steps.push(
			inTree('Fetch origin/main', [
				'git',
				'fetch',
				'origin',
				'main',
				'--tags',
				'--quiet',
			]),
			inTree('Release version check', [
				'bun',
				'run',
				'release:check',
				'origin/main',
			]),
		)
	}
	return steps
}

// Same names, no work: lets the live list, report and cleanup output be checked quickly.
export function toDryRun(steps: Step[], cwd: string): Step[] {
	return steps.map(({ name }) => ({ name, command: ['true'], cwd }))
}

// Whether the run got as far as starting the API-test database (cleanup stops it).
export function reachedDatabaseStep(steps: Step[], states: StepState[]) {
	return steps.some(
		(step, index) => step.startsDatabase && states[index].status !== 'pending',
	)
}
