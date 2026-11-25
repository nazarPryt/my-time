import { fit, stripAnsi } from './progress'

const PADDING = 2

// Frames lines in a rounded box sized to the widest line, capped at maxWidth columns.
export function drawBox(
	lines: string[],
	{
		maxWidth,
		border = (text: string) => text,
	}: { maxWidth: number; border?: (text: string) => string },
): string[] {
	const limit = Math.max(maxWidth - 2 - PADDING * 2, 10)
	const inner = Math.min(
		Math.max(...lines.map((line) => Bun.stringWidth(line))),
		limit,
	)
	const pad = ' '.repeat(PADDING)
	const body = lines.map((line) => {
		const fitted =
			Bun.stringWidth(line) > inner ? fit(stripAnsi(line), inner) : line
		const fill = ' '.repeat(inner - Bun.stringWidth(fitted))
		return `${border('│')}${pad}${fitted}${fill}${pad}${border('│')}`
	})
	const rule = '─'.repeat(inner + PADDING * 2)
	return [border(`╭${rule}╮`), ...body, border(`╰${rule}╯`)]
}
