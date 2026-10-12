import { Button } from '@/shared/ui'
import type { loadDesktopRequest } from '../api/desktop-pairing'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '../testIds'

export function DesktopConnectionConfirmation({
	request,
	busy,
	onConnect,
}: {
	request: Awaited<ReturnType<typeof loadDesktopRequest>>
	busy: boolean
	onConnect(): Promise<void>
}) {
	return (
		<>
			<p className="text-sm text-muted-foreground">
				Check that this code matches the code in desktop Settings. Only connect
				if you started this request on your own desktop.
			</p>
			<p className="font-mono text-2xl tracking-widest" data-testid={DC.code}>
				{request.confirmationCode}
			</p>
			<p className="break-all text-sm" data-testid={DC.account}>
				Sign in as <span className="font-medium">{request.email}</span>
			</p>
			<Button
				onClick={() => void onConnect()}
				isLoading={busy}
				data-testid={DC.connect}
			>
				Connect desktop
			</Button>
		</>
	)
}
