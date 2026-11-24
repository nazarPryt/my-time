import { renderLines, type View } from './progress'

// The redraw moves up exactly as many rows as it printed, so a wrapped line would
// leave a stale copy of the frame's top line behind. Wrapping stays off while drawing.
const ENTER = '\x1b[?25l\x1b[?7l'
const LEAVE = '\x1b[?25h\x1b[?7h'

// The view's states and timings are mutated by the pipeline; each frame re-reads them.
export function createTui(view: Omit<View, 'now' | 'columns' | 'rows'>) {
	let drawn = 0
	let timer: Timer | undefined

	function draw() {
		const lines = renderLines({
			...view,
			now: Date.now(),
			columns: process.stdout.columns ?? 80,
			rows: process.stdout.rows ?? 24,
		})
		const up = drawn ? `\x1b[${drawn}F` : ''
		process.stdout.write(`${up}\x1b[0J${lines.join('\n')}\n`)
		drawn = lines.length
	}

	process.on('exit', () => process.stdout.write(LEAVE))
	return {
		start() {
			process.stdout.write(ENTER)
			draw()
			timer = setInterval(draw, 100)
		},
		stop() {
			if (!timer) return
			clearInterval(timer)
			timer = undefined
			draw()
			process.stdout.write(LEAVE)
		},
	}
}
