import { Button, Skeleton, SkeletonStatus } from '@/shared/ui'
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
				<SkeletonStatus
					label="Loading connection request…"
					className="space-y-4"
				>
					<div className="space-y-2">
						<Skeleton className="h-3.5 w-full" />
						<Skeleton className="h-3.5 w-3/5" />
					</div>
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-3.5 w-52" />
					<Skeleton className="h-9 w-36" />
				</SkeletonStatus>
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
