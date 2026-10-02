import type { BlockedSiteResponse } from 'contracts'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { useFavicon } from '../../model/use-favicon'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

interface Props {
	site: BlockedSiteResponse
	onRemove: () => void
}

export function BlockedSiteItem({ site, onRemove }: Props) {
	return (
		<li
			className="flex items-center justify-between px-4 py-3"
			data-testid={SB.siteRow}
		>
			<div className="flex items-center gap-3">
				<SiteFavicon domain={site.domain} />
				<div>
					<p
						className="text-sm font-medium text-foreground"
						data-testid={SB.siteDomain}
					>
						{site.domain}
					</p>
					<p
						className="text-xs text-muted-foreground"
						data-testid={SB.siteAddedAt}
					>
						Added {format(new Date(site.createdAt), 'MMM d, yyyy')}
					</p>
				</div>
			</div>
			<ConfirmDialog
				trigger={
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-destructive"
						data-testid={SB.siteRemoveTrigger}
					>
						<Trash2 size={15} />
					</Button>
				}
				title="Remove blocked site"
				description={`Are you sure you want to unblock "${site.domain}"?`}
				confirmLabel="Remove"
				variant="destructive"
				onConfirm={onRemove}
			/>
		</li>
	)
}

/** Renders nothing once the icon fails to load, rather than a broken image. */
function SiteFavicon({ domain }: { domain: string }) {
	const favicon = useFavicon(domain)
	if (!favicon.src) return null
	return (
		<img
			src={favicon.src}
			alt=""
			width={20}
			height={20}
			className="rounded-sm shrink-0"
			onError={favicon.onError}
			data-testid={SB.siteFavicon}
		/>
	)
}
