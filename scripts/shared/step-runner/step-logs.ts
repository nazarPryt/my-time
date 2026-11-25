import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

// One log file per step, numbered so they sort in run order.
export function stepLogPath(logDir: string, index: number, name: string) {
	const number = String(index + 1).padStart(2, '0')
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
	return resolve(logDir, `${number}-${slug}.log`)
}

export async function resetLogDir(logDir: string) {
	await rm(logDir, { recursive: true, force: true })
	await mkdir(logDir, { recursive: true })
}

export async function readLogTail(file: string, maxLines: number) {
	const lines = (await Bun.file(file).text()).trimEnd().split('\n')
	return lines.slice(-maxLines)
}
