import { DownloadIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/shared/ui'
import { extensionDownloadUrl } from '../../lib/extension-download-url'

interface DownloadExtensionButtonProps {
	testId: string
	children: ReactNode
}

/** Downloads the versioned extension zip (manual-install path). */
export function DownloadExtensionButton({
	testId,
	children,
}: DownloadExtensionButtonProps) {
	return (
		<Button size="sm" asChild>
			<a href={extensionDownloadUrl()} download data-testid={testId}>
				<DownloadIcon />
				{children}
			</a>
		</Button>
	)
}
