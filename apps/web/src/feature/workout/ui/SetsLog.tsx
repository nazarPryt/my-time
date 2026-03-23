import type { SetResponse } from 'contracts'
import { Flame, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SetRow } from './SetRow'

interface SetsLogProps {
	sets: SetResponse[]
	onDelete: (id: string) => void
	onReset: () => void
}

export function SetsLog({ sets, onDelete, onReset }: SetsLogProps) {
	if (sets.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-border p-10 flex flex-col items-center gap-2">
				<Flame
					size={18}
					strokeWidth={1.5}
					className="text-muted-foreground/30"
				/>
				<p className="text-xs text-muted-foreground/50">
					No sets yet. Start pushing.
				</p>
			</div>
		)
	}
	return (
		<div className="rounded-xl border border-border bg-card overflow-hidden">
			<div className="px-5 py-3 border-b border-border flex items-center justify-between">
				<span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60">
					Sets · {sets.length}
				</span>
				<ConfirmDialog
					trigger={
						<button
							type="button"
							className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<RotateCcw size={10} strokeWidth={2.5} />
							Reset day
						</button>
					}
					title="Reset today's sets?"
					description={`All ${sets.length} set${sets.length !== 1 ? 's' : ''} will be permanently deleted.`}
					confirmLabel="Reset"
					variant="destructive"
					onConfirm={onReset}
				/>
			</div>
			<div className="divide-y divide-border max-h-56 overflow-auto">
				{[...sets].reverse().map((set, i) => (
					<SetRow
						key={set.id}
						set={set}
						animate={i === 0}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	)
}
