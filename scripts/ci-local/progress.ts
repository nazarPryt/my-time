export type StepStatus =
	| 'pending'
	| 'running'
	| 'passed'
	| 'failed'
	| 'interrupted'

export interface StepState {
	name: string
	status: StepStatus
	startedAt?: number
	endedAt?: number
	exitCode?: number
	lastLine?: string
}

export interface View {
	title: string
	states: StepState[]
	timings: Record<string, number>
	startedAt: number
	now: number
	columns: number
	rows: number
}

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
const color = (code: number) => (text: string) => `\x1b[${code}m${text}\x1b[0m`
export const paint = {
	green: color(32),
	red: color(31),
	yellow: color(33),
	cyan: color(36),
	dim: color(2),
	bold: color(1),
}

export function stripAnsi(text: string): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: matching escape codes is the point
	return text.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '')
}

export function lastLine(chunk: string): string | undefined {
	const lines = stripAnsi(chunk)
		.split(/\r\n|\r|\n/)
		.map((line) => line.trim())
		.filter(Boolean)
	return lines.at(-1)
}

export function formatDuration(ms: number): string {
	const seconds = ms / 1000
	if (seconds < 10) return `${seconds.toFixed(1)}s`
	if (seconds < 60) return `${Math.round(seconds)}s`
	const minutes = Math.floor(seconds / 60)
	return `${minutes}m ${String(Math.round(seconds % 60)).padStart(2, '0')}s`
}

export function progressBar(ratio: number, width: number): string {
	const filled = Math.round(Math.min(Math.max(ratio, 0), 1) * width)
	return '█'.repeat(filled) + '░'.repeat(width - filled)
}

export function fit(text: string, width: number): string {
	return text.length <= width
		? text
		: `${text.slice(0, Math.max(width - 1, 0))}…`
}

// Undefined while any remaining step has never been timed.
export function estimateRemaining(
	view: Pick<View, 'states' | 'timings' | 'now'>,
) {
	let total = 0
	for (const state of view.states) {
		if (state.status === 'passed' || state.status === 'failed') continue
		const previous = view.timings[state.name]
		if (previous === undefined) return undefined
		const elapsed = state.startedAt ? view.now - state.startedAt : 0
		total += Math.max(previous - elapsed, 0)
	}
	return total
}

function stepLine(state: StepState, view: View, nameWidth: number) {
	const name = state.name.padEnd(nameWidth)
	const previous = view.timings[state.name]
	const took = (state.endedAt ?? view.now) - (state.startedAt ?? view.now)
	switch (state.status) {
		case 'passed':
			return `${paint.green('✓')} ${name}  ${paint.dim(formatDuration(took))}`
		case 'failed':
			return paint.red(
				`✗ ${name}  ${formatDuration(took)}  exit ${state.exitCode}`,
			)
		case 'interrupted':
			return paint.yellow(`■ ${name}  interrupted`)
		case 'pending':
			return paint.dim(
				`○ ${name}  ${previous === undefined ? '' : `~${formatDuration(previous)}`}`,
			)
		case 'running': {
			const spinner = paint.cyan(
				SPINNER[Math.floor(view.now / 100) % SPINNER.length],
			)
			if (previous === undefined)
				return `${spinner} ${paint.bold(name)}  ${formatDuration(took)}`
			const ratio = Math.min(took / previous, 0.99)
			const percent = `${Math.round(ratio * 100)}%`.padStart(4)
			return `${spinner} ${paint.bold(name)}  ${paint.cyan(progressBar(ratio, 12))} ${percent}  ${formatDuration(took)} / ~${formatDuration(previous)}`
		}
	}
}

// Fits the terminal: lines never wrap and the list scrolls around the running step.
export function renderLines(view: View): string[] {
	const width = Math.max(view.columns - 1, 20)
	const nameWidth = Math.min(
		Math.max(...view.states.map(({ name }) => name.length)),
		32,
	)
	const done = view.states.filter(({ status }) => status === 'passed').length
	const remaining = estimateRemaining(view)
	const summary = [
		`${done}/${view.states.length} steps`,
		`${formatDuration(view.now - view.startedAt)} elapsed`,
		remaining === undefined ? undefined : `~${formatDuration(remaining)} left`,
	]
		.filter(Boolean)
		.join(' · ')
	const header = [
		paint.bold(fit(view.title, width)),
		`${paint.cyan(progressBar(done / view.states.length, 24))} ${fit(summary, width - 25)}`,
		'',
	]
	const current = view.states.findIndex(({ status }) => status !== 'passed')
	const running = view.states[current]
	const detail =
		running?.status === 'running' && running.lastLine
			? paint.dim(`  └ ${fit(running.lastLine, width - 4)}`)
			: undefined
	const room = Math.max(view.rows - header.length - (detail ? 2 : 1), 3)
	const first =
		view.states.length <= room
			? 0
			: Math.min(
					Math.max(
						(current < 0 ? view.states.length : current) - Math.floor(room / 3),
						0,
					),
					view.states.length - room,
				)
	const lines = [...header]
	view.states.slice(first, first + room).forEach((state, offset) => {
		const plainWidth = stripAnsi(stepLine(state, view, nameWidth)).length
		const line = stepLine(state, view, nameWidth)
		lines.push(plainWidth > width ? fit(stripAnsi(line), width) : line)
		if (first + offset === current && detail) lines.push(detail)
	})
	return lines
}
