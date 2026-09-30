import { createFileRoute } from '@tanstack/react-router'
import { TimeTrackerPage } from '@/pages/time-tracker'

export const Route = createFileRoute('/dashboard/time-tracker')({
	component: TimeTrackerPage,
})
