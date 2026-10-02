import {
	BlockListEditor,
	ExtensionPanel,
	ExtensionStatusBadge,
} from '@/features/site-blocking'
import { SITE_BLOCKING_TEST_IDS as SB } from '@/features/site-blocking/testIds'

export function SiteBlockingPage() {
	return (
		<div className="h-full flex flex-col" data-testid={SB.page}>
			<header className="h-14 flex items-center justify-between px-4 sm:px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground">Site Blocking</h1>
				<ExtensionStatusBadge />
			</header>

			<div className="flex-1 overflow-auto p-4 sm:p-8">
				<div className="max-w-lg mx-auto space-y-6">
					<ExtensionPanel />
					<BlockListEditor />
				</div>
			</div>
		</div>
	)
}
