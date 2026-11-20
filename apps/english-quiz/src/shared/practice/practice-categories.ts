/** Hub sections, in display order. */
export const PRACTICE_CATEGORIES = [
	{ id: 'assessment', title: 'Check your level' },
	{ id: 'grammar', title: 'Grammar practice' },
] as const

export type PracticeCategory = (typeof PRACTICE_CATEGORIES)[number]
export type PracticeCategoryId = PracticeCategory['id']
