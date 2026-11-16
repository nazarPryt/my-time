import {
	PRACTICE_CATEGORIES,
	type PracticeCategory,
	type PracticeCategoryId,
} from '../shared/practice/practice-categories'

export interface CategoryGroup<Mode> {
	category: PracticeCategory
	modes: readonly Mode[]
}

/** Skips empty categories. */
export function groupByCategory<Mode extends { category: PracticeCategoryId }>(
	modes: readonly Mode[],
): CategoryGroup<Mode>[] {
	return PRACTICE_CATEGORIES.map((category) => ({
		category,
		modes: modes.filter((mode) => mode.category === category.id),
	})).filter((group) => group.modes.length > 0)
}
