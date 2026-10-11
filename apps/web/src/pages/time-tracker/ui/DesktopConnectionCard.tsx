import { useEffect, useState } from 'react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import {
	approveDesktopRequest,
	loadDesktopRequest,
} from '../api/desktop-pairing'
import { DESKTOP_CONNECTION_TEST_IDS as DC } from '../testIds'

export function DesktopConnectionCard({
	requestId,
	onApproved,
	onDismiss,
}: {
	requestId: string
	onApproved(): void
	onDismiss(): void
}) {
	const [request, setRequest] = useState<{
		confirmationCode: string
		email: string
	} | null>(null)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [approved, setApproved] = useState(false)
	useEffect(() => {
		let active = true
		setRequest(null)
		setApproved(false)
		setError('')
		void loadDesktopRequest(requestId).then(
			(result) => {
				if (active) setRequest(result)
			},
			() => {
				if (active)
					setError(
						'This connection request expired. Start again from desktop Settings.',
					)
			},
		)
		return () => {
			active = false
		}
	}, [requestId])

	async function connect() {
		if (busy || approved) return
		setBusy(true)
		setError('')
		try {
			await approveDesktopRequest(requestId)
			setApproved(true)
			onApproved()
		} catch {
			setError('Unable to connect. Start again from desktop Settings.')
		} finally {
			setBusy(false)
		}
	}

	return (
		<Card className="border-primary/40" data-testid={DC.card}>
			<CardHeader>
				<CardTitle>
					{approved ? 'Desktop connection approved' : 'Connect your desktop'}
				</CardTitle>
				<CardDescription>
					{approved
						? 'Your desktop will sign in automatically. No further action is needed.'
						: 'Use your signed-in my·time account on your desktop.'}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{request && !approved && (
					<>
						<p className="text-sm text-muted-foreground">
							Check that this code matches the code in desktop Settings. Only
							connect if you started this request on your own desktop.
						</p>
						<p
							className="font-mono text-2xl tracking-widest"
							data-testid={DC.code}
						>
							{request.confirmationCode}
						</p>
						<p className="break-all text-sm" data-testid={DC.account}>
							Sign in as <span className="font-medium">{request.email}</span>
						</p>
						<Button
							onClick={() => void connect()}
							isLoading={busy}
							data-testid={DC.connect}
						>
							Connect desktop
						</Button>
					</>
				)}
				{!request && !error && (
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
					<Button
						variant="outline"
						onClick={onDismiss}
						data-testid={DC.dismiss}
					>
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
			</CardContent>
		</Card>
	)
}
