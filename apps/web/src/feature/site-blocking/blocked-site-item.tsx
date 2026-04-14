import type { BlockedSiteResponse } from 'contracts'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useFavicon } from './use-favicon'

interface Props {
	site: BlockedSiteResponse
	onRemove: () => void
}

export function BlockedSiteItem({ site, onRemove }: Props) {
	const favicon = useFavicon(site.domain)

	return (
		<li className="flex items-center justify-between px-4 py-3">
			<div className="flex items-center gap-3">
				{favicon.src && (
					<img
						src={favicon.src}
						alt=""
						width={20}
						height={20}
						className="rounded-sm shrink-0"
						onError={favicon.onError}
					/>
				)}
				<div>
					<p className="text-sm font-medium text-foreground">{site.domain}</p>
					<p className="text-xs text-muted-foreground">
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
