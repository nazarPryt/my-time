import { createFileRoute } from '@tanstack/react-router'
import { EnglishQuizPage } from '@/pages/english-quiz'

export const Route = createFileRoute('/dashboard/english-quiz')({
	component: EnglishQuizPage,
})
