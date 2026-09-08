import type { PermessoStatusResponse } from 'contracts'
import { Send } from 'lucide-react'
import { useState } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

type Props = {
	status: PermessoStatusResponse
	connecting: boolean
	disconnecting: boolean
	error: string | null
	onConnect: () => void
	onDisconnect: () => void
}

export function TelegramCard({
	status,
	connecting,
	disconnecting,
	error,
	onConnect,
	onDisconnect,
}: Props) {
	const [confirmingDisconnect, setConfirmingDisconnect] = useState(false)

	function confirmDisconnect() {
		setConfirmingDisconnect(false)
		onDisconnect()
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Send size={16} className="text-muted-foreground" />
						Telegram notifications
					</CardTitle>
					<CardDescription>
						Get a message on Telegram after every check.
					</CardDescription>
					<CardAction>
						{status.telegramConnected ? (
							<Button
								size="sm"
								variant="outline"
								onClick={() => setConfirmingDisconnect(true)}
								disabled={disconnecting}
								isLoading={disconnecting}
							>
								Disconnect
							</Button>
						) : (
							<Button
								size="sm"
								onClick={onConnect}
								disabled={connecting}
								isLoading={connecting}
							>
								Connect Telegram
							</Button>
						)}
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-2">
					{status.telegramConnected ? (
						<Badge>Connected</Badge>
					) : connecting ? (
						<p className="text-sm text-muted-foreground">
							Opened Telegram — tap "Start" in the chat to finish connecting.
						</p>
					) : (
						<p className="text-sm text-muted-foreground">Not connected.</p>
					)}
					{error && <p className="text-sm text-destructive">{error}</p>}
				</CardContent>
			</Card>

			<AlertDialog
				open={confirmingDisconnect}
				onOpenChange={setConfirmingDisconnect}
			>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Disconnect Telegram?</AlertDialogTitle>
						<AlertDialogDescription>
							You'll stop receiving check-result messages until you connect
							again.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDisconnect}>
							Disconnect
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
