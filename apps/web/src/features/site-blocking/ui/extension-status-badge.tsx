import { PuzzleIcon } from 'lucide-react'
import { Badge } from '@/shared/ui'
import type { ExtensionStatus } from '../model/use-extension-connection'

const LABELS: Record<ExtensionStatus, string> = {
	checking: 'Checking extension…',
	'not-installed': 'Extension not installed',
	'not-linked': 'Extension not connected',
	linked: 'Extension active',
}

export function ExtensionStatusBadge({ status }: { status: ExtensionStatus }) {
	const variant =
		status === 'linked'
			? 'success'
			: status === 'checking'
				? 'outline'
				: 'warning'

	return (
		<Badge variant={variant} className="h-6 gap-1.5 px-2.5">
			<PuzzleIcon />
			{LABELS[status]}
		</Badge>
	)
}
