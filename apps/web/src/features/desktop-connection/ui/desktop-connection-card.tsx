import { Card, CardContent } from '@/shared/ui'
import { useDesktopConnection } from '../model/use-desktop-connection'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '../test-ids'
import { DesktopConnectionConfirmation } from './desktop-connection-confirmation'
import { DesktopConnectionFeedback } from './desktop-connection-feedback'
import { DesktopConnectionHeader } from './desktop-connection-header'

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
