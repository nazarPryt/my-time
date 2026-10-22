import { Link } from '@tanstack/react-router'
import { Monitor } from 'lucide-react'
import { Badge } from '@/shared/ui'
import { useDesktopStatus } from '../model/use-desktop-status'
import { TIME_TRACKER_TEST_IDS as TT } from '../testIds'

export function DesktopStatusBadge() {
	const status = useDesktopStatus()
	const labels = {
		checking: 'Checking desktop…',
		connected: 'Desktop connected · Synced',
		disconnected: 'Desktop not connected',
		unknown: 'Desktop status unavailable',
	} as const
	const connected = status === 'connected'
	const content = (
		<>
			<Monitor aria-hidden="true" />
			{labels[status]}
		</>
	)
	return (
		<Badge
			asChild={!connected}
			variant={
				status === 'connected'
					? 'success'
					: status === 'unknown'
						? 'warning'
						: 'outline'
			}
			className={`h-6 gap-1.5 px-2.5${connected ? '' : ' hover:bg-muted'}`}
			data-testid={TT.desktopStatusBadge}
			title={
				status === 'connected'
					? 'A GNOME desktop is connected to your account and receiving live session updates.'
					: undefined
			}
		>
			{connected ? (
				content
			) : (
				<Link
					to="/dashboard/time-tracker/desktop"
					aria-label={`${labels[status]}. Open desktop setup.`}
				>
					{content}
				</Link>
			)}
		</Badge>
	)
}
