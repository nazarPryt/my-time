import type { PermessoStatusResponse } from 'contracts'
import { Send } from 'lucide-react'
import { useState } from 'react'
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
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

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
						<Badge variant="success">Connected</Badge>
					) : connecting ? (
						<p className="text-sm text-muted-foreground">
							Opened Telegram — tap "Start" in the chat to finish connecting.
						</p>
					) : (
						<Badge variant="destructive">Not connected</Badge>
					)}
					{error && <p className="text-sm text-destructive">{error}</p>}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmingDisconnect}
				onOpenChange={setConfirmingDisconnect}
				title="Disconnect Telegram?"
				description="You'll stop receiving check-result messages until you connect again."
				confirmLabel="Disconnect"
				onConfirm={onDisconnect}
			/>
		</>
	)
}
