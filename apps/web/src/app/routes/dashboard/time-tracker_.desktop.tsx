import { createFileRoute } from '@tanstack/react-router'
import { DesktopPage } from '@/pages/desktop'

export const Route = createFileRoute('/dashboard/time-tracker_/desktop')({
	component: DesktopPage,
})
