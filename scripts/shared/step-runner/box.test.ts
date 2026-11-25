import { expect, test } from 'bun:test'
import { drawBox } from './box'
import { paint, stripAnsi } from './progress'

test('drawBox sizes every row to the widest line', () => {
	expect(drawBox(['ab', 'abcd'], { maxWidth: 80 })).toEqual([
		'╭────────╮',
		'│  ab    │',
		'│  abcd  │',
		'╰────────╯',
	])
})

test('drawBox ignores colour codes and counts wide characters', () => {
	const rows = drawBox([paint.green('ok'), '🚀 go'], { maxWidth: 80 })
	const widths = rows.map((row) => Bun.stringWidth(row))
	expect(new Set(widths).size).toBe(1)
})

test('drawBox truncates lines wider than maxWidth', () => {
	const rows = drawBox(['x'.repeat(50)], { maxWidth: 20 })
	for (const row of rows) expect(Bun.stringWidth(stripAnsi(row))).toBe(20)
	expect(rows[1]).toContain('…')
})
