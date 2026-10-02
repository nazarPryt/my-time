import { PuzzleIcon } from 'lucide-react'
import { Badge } from '@/shared/ui'
import type { ExtensionStatus } from '../model/use-extension-connection'

const LABELS: Record<ExtensionStatus, string> = {
	checking: 'Checking extension…',
	'not-installed': 'Extension not installed',
	'not-linked': 'Extension not connected',
	linked: 'Extension active',
}

interface ExtensionStatusBadgeProps {
	status: ExtensionStatus
	updateAvailable: boolean
}

export function ExtensionStatusBadge({
	status,
	updateAvailable,
}: ExtensionStatusBadgeProps) {
	const variant =
		status === 'linked' && !updateAvailable
			? 'success'
			: status === 'checking'
				? 'outline'
				: 'warning'
	// Install/connect problems outrank an update — they mean nothing is blocked.
	const label =
		status === 'linked' && updateAvailable
			? 'Extension update available'
			: LABELS[status]

	return (
		<Badge variant={variant} className="h-6 gap-1.5 px-2.5">
			<PuzzleIcon />
			{label}
		</Badge>
	)
}
