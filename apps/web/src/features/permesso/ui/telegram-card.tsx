import type { PermessoStatusResponse } from 'contracts'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { PERMESSO_TEST_IDS } from '../testIds'

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
								data-testid={PERMESSO_TEST_IDS.telegramDisconnect}
								onClick={() => setConfirmingDisconnect(true)}
								disabled={disconnecting}
								isLoading={disconnecting}
							>
								Disconnect
							</Button>
						) : (
							<Button
								size="sm"
								data-testid={PERMESSO_TEST_IDS.telegramConnect}
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
						<Badge
							data-testid={PERMESSO_TEST_IDS.telegramStatus}
							variant="success"
						>
							Connected
						</Badge>
					) : connecting ? (
						<p
							data-testid={PERMESSO_TEST_IDS.telegramPending}
							className="text-sm text-muted-foreground"
						>
							Opened Telegram — tap "Start" in the chat to finish connecting.
						</p>
					) : (
						<Badge
							data-testid={PERMESSO_TEST_IDS.telegramStatus}
							variant="destructive"
						>
							Not connected
						</Badge>
					)}
					{error && (
						<p
							data-testid={PERMESSO_TEST_IDS.telegramError}
							className="text-sm text-destructive"
						>
							{error}
						</p>
					)}
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
