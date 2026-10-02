import type { BlockedSiteResponse } from 'contracts'
import { ShieldOff } from 'lucide-react'
import { SITE_BLOCKING_TEST_IDS as SB } from '../testIds'
import { BlockedSiteItem } from './blocked-site-item'

type Props = {
	sites: BlockedSiteResponse[]
	loading: boolean
	onRemove: (id: string) => void
}

export function SiteList({ sites, loading, onRemove }: Props) {
	if (loading) {
		return (
			<div
				className="flex items-center justify-center h-32"
				data-testid={SB.listLoading}
			>
				<span className="text-xs text-muted-foreground">Loading…</span>
			</div>
		)
	}

	if (sites.length === 0) {
		return (
			<div
				className="flex flex-col items-center justify-center gap-2 h-32 text-center px-6"
				data-testid={SB.listEmpty}
			>
				<ShieldOff size={20} className="text-muted-foreground/40" />
				<span className="text-xs text-muted-foreground">
					No sites blocked yet
				</span>
			</div>
		)
	}

	return (
		<ul className="divide-y divide-border" data-testid={SB.siteList}>
			{sites.map((site) => (
				<BlockedSiteItem
					key={site.id}
					site={site}
					onRemove={() => onRemove(site.id)}
				/>
			))}
		</ul>
	)
}
