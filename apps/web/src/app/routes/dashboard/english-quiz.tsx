import { createFileRoute } from '@tanstack/react-router'
import { validateEnglishQuizSearch } from '@/features/english-quiz'
import { EnglishQuizPage } from '@/pages/english-quiz'

export const Route = createFileRoute('/dashboard/english-quiz')({
	validateSearch: validateEnglishQuizSearch,
	component: EnglishQuizPage,
})
