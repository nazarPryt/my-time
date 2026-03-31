import { createFileRoute } from '@tanstack/react-router'
import { TimeTrackerWidget } from '@/feature/time-tracker/ui/TimeTrackerWidget'

export const Route = createFileRoute('/dashboard/time-tracker')({
	component: TimeTrackerPage,
})

function TimeTrackerPage() {
	return <TimeTrackerWidget />
}
