import { Plus } from 'lucide-react'

const QUICK_ADD = [1, 5, 10, 25] as const

interface QuickAddButtonsProps {
	onAdd: (reps: number) => void
	disabled?: boolean
}

export function QuickAddButtons({ onAdd, disabled }: QuickAddButtonsProps) {
	return (
		<div className="grid grid-cols-4 gap-2">
			{QUICK_ADD.map((n) => (
				<button
					type="button"
					key={n}
					onClick={() => onAdd(n)}
					disabled={disabled}
					className="group h-[68px] rounded-xl border border-border bg-card hover:bg-muted active:scale-95 transition-all duration-100 flex flex-col items-center justify-center gap-0.5 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Plus
						size={11}
						strokeWidth={2.5}
						className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors"
					/>
					<span className="text-[22px] font-bold tabular-nums text-foreground leading-none tracking-tight">
						{n}
					</span>
				</button>
			))}
		</div>
	)
}
