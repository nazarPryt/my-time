import { Button } from '@/shared/ui'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '../testIds'

export function DesktopConnectionFeedback({
	loading,
	approved,
	error,
	onDismiss,
}: {
	loading: boolean
	approved: boolean
	error: string
	onDismiss(): void
}) {
	return (
		<>
			{loading && (
				<output className="block text-sm text-muted-foreground">
					Loading connection request…
				</output>
			)}
			{approved && (
				<output className="block text-sm" data-testid={DC.approved}>
					Click Done to continue using the time tracker.
				</output>
			)}
			{(approved || error) && (
				<Button variant="outline" onClick={onDismiss} data-testid={DC.dismiss}>
					{approved ? 'Done' : 'Dismiss'}
				</Button>
			)}
			{error && (
				<p
					className="text-sm text-destructive"
					role="alert"
					data-testid={DC.error}
				>
					{error}
				</p>
			)}
		</>
	)
}
