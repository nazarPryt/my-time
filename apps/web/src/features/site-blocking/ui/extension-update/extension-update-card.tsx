import { RefreshCwIcon } from 'lucide-react'
import { WEB_CONFIG } from '@/shared/config/web-config'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'
import { StoreUpdateSteps } from './store-update-steps'
import { ZipUpdateSteps } from './zip-update-steps'

interface ExtensionUpdateCardProps {
	installedVersion: string | null
	latestVersion: string
}

export function ExtensionUpdateCard({
	installedVersion,
	latestVersion,
}: ExtensionUpdateCardProps) {
	const youHave = installedVersion
		? `you have ${installedVersion}.`
		: 'you have an older version.'

	return (
		<Card className="ring-amber-500/40" data-testid={SB.updateCard}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<RefreshCwIcon className="size-4 text-amber-500" />
					Extension update available
				</CardTitle>
				<CardDescription data-testid={SB.updateDescription}>
					Version {latestVersion} is out — {youHave} Blocking keeps working
					meanwhile, but updating brings the latest fixes.
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
