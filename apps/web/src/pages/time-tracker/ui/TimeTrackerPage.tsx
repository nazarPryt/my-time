import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { TimeTrackerWidget } from '@/features/time-tracker'
import { DesktopConnectionCard } from './DesktopConnectionCard'

export function TimeTrackerPage({
	desktopRequest,
}: {
	desktopRequest?: string
}) {
	const navigate = useNavigate()
	const [activeRequest, setActiveRequest] = useState(desktopRequest)
	useEffect(() => {
		if (desktopRequest) setActiveRequest(desktopRequest)
	}, [desktopRequest])
	const clearRequestUrl = () => {
		void navigate({ to: '/dashboard/time-tracker', search: {}, replace: true })
	}
	const dismissRequest = () => {
		setActiveRequest(undefined)
		clearRequestUrl()
	}
	return (
		<div className="space-y-6">
			{activeRequest && (
				<DesktopConnectionCard
					key={activeRequest}
					requestId={activeRequest}
					onApproved={clearRequestUrl}
					onDismiss={dismissRequest}
				/>
			)}
			<TimeTrackerWidget />
		</div>
	)
}
