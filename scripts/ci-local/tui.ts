import { renderLines, type View } from './progress'

const HIDE_CURSOR = '\x1b[?25l'
const SHOW_CURSOR = '\x1b[?25h'

export function createTui(
	getView: () => Omit<View, 'now' | 'columns' | 'rows'>,
) {
	let drawn = 0
	let timer: Timer | undefined

	function draw() {
		const lines = renderLines({
			...getView(),
			now: Date.now(),
			columns: process.stdout.columns ?? 80,
			rows: process.stdout.rows ?? 24,
		})
		const up = drawn ? `\x1b[${drawn}F` : ''
		process.stdout.write(`${up}\x1b[0J${lines.join('\n')}\n`)
		drawn = lines.length
	}

	process.on('exit', () => process.stdout.write(SHOW_CURSOR))
	return {
		start() {
			process.stdout.write(HIDE_CURSOR)
			draw()
			timer = setInterval(draw, 100)
		},
		stop() {
			if (!timer) return
			clearInterval(timer)
			timer = undefined
			draw()
			process.stdout.write(SHOW_CURSOR)
		},
	}
}
