import { PuzzleIcon } from 'lucide-react'
import { Badge } from '@/shared/ui'
import { statusBadgeFor } from '../lib/extension-status'
import { useExtensionConnection } from '../model/use-extension-connection'
import { SITE_BLOCKING_TEST_IDS as SB } from '../testIds'

/** Header badge summarising the extension: checking / missing / unlinked / active / outdated. */
export function ExtensionStatusBadge() {
	const { status, updateAvailable } = useExtensionConnection()
	const { label, variant } = statusBadgeFor(status, updateAvailable)

	return (
		<Badge
			variant={variant}
			className="h-6 gap-1.5 px-2.5"
			data-testid={SB.statusBadge}
			data-variant={variant}
		>
			<PuzzleIcon />
			{label}
		</Badge>
	)
}
