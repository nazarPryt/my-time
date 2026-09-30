import type { BlockedSiteResponse } from 'contracts'
import { ShieldOff } from 'lucide-react'
import { BlockedSiteItem } from './blocked-site-item'

type Props = {
	sites: BlockedSiteResponse[]
	loading: boolean
	onRemove: (id: string) => void
}

export function SiteList({ sites, loading, onRemove }: Props) {
	if (loading) {
		return (
			<div className="flex items-center justify-center h-32">
				<span className="text-xs text-muted-foreground">Loading…</span>
			</div>
		)
	}

	if (sites.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 h-32 text-center px-6">
				<ShieldOff size={20} className="text-muted-foreground/40" />
				<span className="text-xs text-muted-foreground">
					No sites blocked yet
				</span>
			</div>
		)
	}

	return (
		<ul className="divide-y divide-border">
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
