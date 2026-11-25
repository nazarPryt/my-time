import { rm } from 'node:fs/promises'
import type { ProcessRunner } from '../shared/step-runner'
import type { CiConfig } from './config'
import { testCompose } from './steps'

export function git(root: string, ...args: string[]): string {
	return Bun.spawnSync(['git', ...args], { cwd: root })
		.stdout.toString()
		.trim()
}

export function composeDown(
	runner: ProcessRunner,
	root: string,
	project: string,
): Promise<boolean> {
	return runner.succeeds([...testCompose(project), 'down', '--volumes'], root)
}

export async function removeWorktree(
	runner: ProcessRunner,
	{ root, worktree }: Pick<CiConfig, 'root' | 'worktree'>,
): Promise<boolean> {
	await rm(worktree, { recursive: true, force: true })
	return runner.succeeds(['git', 'worktree', 'prune'], root)
}
