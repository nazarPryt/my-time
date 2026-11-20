import type { EnglishQuizEvent, QuizLevel } from '@my-time/micro-frontends'
import type { Component } from 'vue'
import type { PracticeCategoryId } from './practice-categories'

export interface ModeContext {
	initialLevel: QuizLevel
	report: (event: EnglishQuizEvent) => void
}

/** Exported by each mode's index.ts and registered in the catalog. */
export interface PracticeModeDefinition {
	title: string
	description: string
	category: PracticeCategoryId
	/** e.g. "A2–B2" */
	levels: string
	minutes: number
	component: Component
	props?: (context: ModeContext) => Record<string, unknown>
}
