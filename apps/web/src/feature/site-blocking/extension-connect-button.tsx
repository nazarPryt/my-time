import { PuzzleIcon } from 'lucide-react'
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui'
import { useExtensionConnection } from './use-extension-connection'

function ConnectionIndicator({ connected }: { connected: boolean | null }) {
	if (connected === null) {
		return (
			<span className="size-2 rounded-full bg-muted-foreground/40 animate-pulse" />
		)
	}
	return (
		<span
			className={`size-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
		/>
	)
}

function buttonLabel(connecting: boolean, connected: boolean | null): string {
	if (connecting) return 'Connecting…'
	if (connected === true) return 'Connected'
	if (connected === false) return 'Disconnected'
	return 'Connect Extension'
}

export function ExtensionConnectButton() {
	const { connected, connecting, connect } = useExtensionConnection()

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					onClick={connect}
					disabled={connecting}
					className="gap-2"
				>
					<PuzzleIcon size={14} />
					{buttonLabel(connecting, connected)}
					<ConnectionIndicator connected={connected} />
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				The browser extension enforces site blocking in real time. Connect it
				once to sync your blocked sites list automatically.
			</TooltipContent>
		</Tooltip>
	)
}
