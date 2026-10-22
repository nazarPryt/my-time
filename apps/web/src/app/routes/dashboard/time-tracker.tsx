import { createFileRoute } from '@tanstack/react-router'
import { DesktopPairingIdSchema } from 'contracts'
import { TimeTrackerPage } from '@/pages/time-tracker'

export const Route = createFileRoute('/dashboard/time-tracker')({
	validateSearch: (
		search: Record<string, unknown>,
	): { desktopRequest?: string } => ({
		desktopRequest: DesktopPairingIdSchema.safeParse(search.desktopRequest)
			.data,
	}),
	component: TimeTrackerRoute,
})

function TimeTrackerRoute() {
	const { desktopRequest } = Route.useSearch()
	return <TimeTrackerPage desktopRequest={desktopRequest} />
}
