import { createFileRoute } from '@tanstack/react-router'
import { WorkoutPage } from '@/pages/workout'

export const Route = createFileRoute('/dashboard/workout')({
	component: WorkoutPage,
})
