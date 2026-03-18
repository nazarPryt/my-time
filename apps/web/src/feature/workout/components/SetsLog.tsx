import { format } from 'date-fns'
import { Flame, RotateCcw } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface SetEntry {
	id: string
	exerciseType: string
	reps: number
	createdAt: string
}

interface SetsLogProps {
	sets: SetEntry[]
	onReset: () => void
}

export function SetsLog({ sets, onReset }: SetsLogProps) {
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
	//TODO make AlertDialog as reusable component
	return (
		<div className="rounded-xl border border-border bg-card overflow-hidden">
			<div className="px-5 py-3 border-b border-border flex items-center justify-between">
				<span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60">
					Sets · {sets.length}
				</span>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<button
							type="button"
							className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<RotateCcw size={10} strokeWidth={2.5} />
							Reset day
						</button>
					</AlertDialogTrigger>
					<AlertDialogContent size="sm">
						<AlertDialogHeader>
							<AlertDialogTitle>Reset today's sets?</AlertDialogTitle>
							<AlertDialogDescription>
								All {sets.length} set{sets.length !== 1 ? 's' : ''} will be
								permanently deleted.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction variant="destructive" onClick={onReset}>
								Reset
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<div className="divide-y divide-border max-h-56 overflow-auto">
				{[...sets].reverse().map((set, i) => (
					<div
						key={set.id}
						className={`flex items-center justify-between px-5 py-2.5 ${i === 0 ? 'row-in' : ''}`}
					>
						<span className="text-xs text-muted-foreground/70 tabular-nums">
							{format(new Date(set.createdAt), 'HH:mm')}
						</span>
						<span className="text-sm font-semibold tabular-nums text-foreground">
							+{set.reps}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
