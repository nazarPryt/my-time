import type { RuleSectionKind } from './types'

export const RULE_SECTION_META: Record<
	RuleSectionKind,
	{ label: string; symbol: string }
> = {
	affirmative: { label: 'Affirmative', symbol: '+' },
	question: { label: 'Question', symbol: '?' },
	negative: { label: 'Negative', symbol: '−' },
	usage: { label: 'Usage', symbol: 'i' },
}
