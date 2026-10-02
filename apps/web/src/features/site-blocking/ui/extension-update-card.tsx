import { DownloadIcon, RefreshCwIcon } from 'lucide-react'
import { WEB_CONFIG } from '@/shared/config/web-config'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { extensionDownloadUrl } from '../lib/extension-download-url'
import { SITE_BLOCKING_TEST_IDS as SB } from '../testIds'
import { CHROME_EXTENSIONS_PAGE, CopyableUrl } from './copyable-url'

interface ExtensionUpdateCardProps {
	installedVersion: string | null
	latestVersion: string
}

export function ExtensionUpdateCard({
	installedVersion,
	latestVersion,
}: ExtensionUpdateCardProps) {
	return (
		<Card className="ring-amber-500/40" data-testid={SB.updateCard}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<RefreshCwIcon className="size-4 text-amber-500" />
					Extension update available
				</CardTitle>
				<CardDescription data-testid={SB.updateDescription}>
					Version {latestVersion} is out
					{installedVersion
						? ` — you have ${installedVersion}.`
						: ' — you have an older version.'}{' '}
					Blocking keeps working meanwhile, but updating brings the latest
					fixes.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{WEB_CONFIG.EXTENSION_STORE_URL ? (
					<StoreUpdateSteps />
				) : (
					<ZipUpdateSteps latestVersion={latestVersion} />
				)}
			</CardContent>
		</Card>
	)
}

// Store installs auto-update; these steps just skip Chrome's hours-long wait.
function StoreUpdateSteps() {
	return (
		<ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground marker:text-muted-foreground/60">
			<li>
				Open <CopyableUrl url={CHROME_EXTENSIONS_PAGE} /> in a new tab.
			</li>
			<li>
				Turn on <strong className="text-foreground">Developer mode</strong>{' '}
				(top-right corner) and click{' '}
				<strong className="text-foreground">Update</strong>.
			</li>
		</ol>
	)
}

function ZipUpdateSteps({ latestVersion }: { latestVersion: string }) {
	return (
		<div className="space-y-3">
			<Button size="sm" asChild>
				<a
					href={extensionDownloadUrl()}
					download
					data-testid={SB.updateDownloadLink}
				>
					<DownloadIcon />
					Download v{latestVersion}
				</a>
			</Button>
			<ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground marker:text-muted-foreground/60">
				<li>
					Unzip it into the{' '}
					<strong className="text-foreground">same folder</strong> you installed
					from, replacing the old files.
				</li>
				<li>
					Open <CopyableUrl url={CHROME_EXTENSIONS_PAGE} /> and click the ↻
					reload icon on <strong className="text-foreground">my·time</strong>.
				</li>
			</ol>
			<p className="text-xs text-muted-foreground">
				Keep the same folder — Chrome ties the extension (and your connection)
				to its location, so a new folder means connecting again. This page
				refreshes by itself once the update is in.
			</p>
		</div>
	)
}
