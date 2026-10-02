import { RotateCwIcon } from 'lucide-react'
import { Button } from '@/shared/ui'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

// Chrome doesn't inject content scripts into tabs that were open before the
// install, so this tab can't detect the extension until it's reloaded.
export function ReloadHint() {
	return (
		<p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
			Already installed?
			<Button
				variant="link"
				size="xs"
				className="h-auto px-0"
				onClick={() => window.location.reload()}
				data-testid={SB.reloadBtn}
			>
				<RotateCwIcon />
				Reload this page
			</Button>
		</p>
	)
}
