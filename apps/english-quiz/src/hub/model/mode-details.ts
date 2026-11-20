import type { ModeScore } from '../../progress'

export const MODE_DETAIL_KINDS = ['levels', 'duration', 'score'] as const
export type ModeDetailKind = (typeof MODE_DETAIL_KINDS)[number]

export interface ModeDetail {
	kind: ModeDetailKind
	text: string
}

export function formatScore({ correct, total }: ModeScore): string {
	return `${correct}/${total}`
}

export function describeMode(
	mode: { levels: string; minutes: number },
	score?: ModeScore,
): ModeDetail[] {
	const details: ModeDetail[] = [
		{ kind: 'levels', text: mode.levels },
		{ kind: 'duration', text: `~${mode.minutes} min` },
	]
	if (score)
		details.push({ kind: 'score', text: `Last score ${formatScore(score)}` })
	return details.filter((detail) => detail.text !== '')
}
