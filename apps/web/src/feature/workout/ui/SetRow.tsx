import type { SetResponse } from 'contracts'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface SetRowProps {
	set: SetResponse
	animate?: boolean
	onDelete: (id: string) => void
}

export function SetRow({ set, animate, onDelete }: SetRowProps) {
	return (
		<div
			data-testid="set-row"
			className={`group flex items-center justify-between px-5 py-2.5 ${animate ? 'row-in' : ''}`}
		>
			<span
				data-testid="set-time"
				className="text-xs text-muted-foreground/70 tabular-nums"
			>
				{format(new Date(set.createdAt), 'HH:mm')}
			</span>
			<div className="flex items-center gap-3">
				<span
					data-testid="set-reps"
					className="text-sm font-semibold tabular-nums text-foreground"
				>
					+{set.reps}
				</span>
				<ConfirmDialog
					trigger={
						<button
							data-testid="delete-set-trigger"
							type="button"
							className="text-muted-foreground/50 hover:text-destructive cursor-pointer"
						>
							<Trash2 size={12} strokeWidth={2} />
						</button>
					}
					title="Remove this set?"
					description={`+${set.reps} reps at ${format(new Date(set.createdAt), 'HH:mm')} will be permanently deleted.`}
					confirmLabel="Remove"
					variant="destructive"
					onConfirm={() => onDelete(set.id)}
				/>
			</div>
		</div>
	)
}
