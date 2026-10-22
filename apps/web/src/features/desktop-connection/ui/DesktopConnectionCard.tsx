import { Card, CardContent } from '@/shared/ui'
import { useDesktopConnection } from '../model/use-desktop-connection'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '../testIds'
import { DesktopConnectionConfirmation } from './DesktopConnectionConfirmation'
import { DesktopConnectionFeedback } from './DesktopConnectionFeedback'
import { DesktopConnectionHeader } from './DesktopConnectionHeader'

export function DesktopConnectionCard({
	requestId,
	onApproved,
	onDismiss,
}: {
	requestId: string
	onApproved(): void
	onDismiss(): void
}) {
	const { request, error, busy, approved, connect } = useDesktopConnection(
		requestId,
		onApproved,
	)
	return (
		<Card className="border-primary/40" data-testid={DC.card}>
			<DesktopConnectionHeader approved={approved} />
			<CardContent className="space-y-4">
				{request && !approved && (
					<DesktopConnectionConfirmation
						request={request}
						busy={busy}
						onConnect={connect}
					/>
				)}
				<DesktopConnectionFeedback
					loading={!request && !error}
					approved={approved}
					error={error}
					onDismiss={onDismiss}
				/>
			</CardContent>
		</Card>
	)
}
