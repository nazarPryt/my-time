import { Button } from '@/shared/ui'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

interface ConnectInstructionsProps {
	connecting: boolean
	connectFailed: boolean
	onConnect: () => void
}

/** Step 2 body: the Connect button and its failure message. */
export function ConnectInstructions({
	connecting,
	connectFailed,
	onConnect,
}: ConnectInstructionsProps) {
	return (
		<div className="space-y-2">
			<p className="text-muted-foreground">
				Signs the extension in as you, so it syncs your block list.
			</p>
			<Button
				size="sm"
				onClick={onConnect}
				disabled={connecting}
				data-testid={SB.connectBtn}
			>
				{connecting ? 'Connecting…' : 'Connect extension'}
			</Button>
			{connectFailed && (
				<p className="text-destructive" data-testid={SB.connectError}>
					Couldn't connect. Reload this page and try again.
				</p>
			)}
		</div>
	)
}
