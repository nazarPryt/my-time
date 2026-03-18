import { Target } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface HeroCounterProps {
	total: number
	goal: number
	onGoalChange: (newGoal: number) => void
}

export function HeroCounter({ total, goal, onGoalChange }: HeroCounterProps) {
	const [editingGoal, setEditingGoal] = useState(false)
	const [goalInput, setGoalInput] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (editingGoal) {
			inputRef.current?.focus()
		}
	}, [editingGoal])

	const pct = Math.min(Math.round((total / goal) * 100), 100)
	const done = total >= goal

	const commitGoal = () => {
		const g = parseInt(goalInput, 10)
		if (!Number.isNaN(g) && g > 0) {
			onGoalChange(g)
		}
		setEditingGoal(false)
		setGoalInput('')
	}

	return (
		<div className="rounded-xl border border-border bg-card p-7 flex flex-col items-center gap-5">
			<span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/60">
				Push-ups today
			</span>

			<span
				key={total}
				className="counter-pop font-bold tabular-nums text-foreground leading-none select-none"
				style={{
					fontSize: 'clamp(72px, 14vw, 104px)',
					letterSpacing: '-0.04em',
				}}
			>
				{total}
			</span>

			<div className="w-full space-y-2">
				<div className="w-full h-[3px] rounded-full bg-muted overflow-hidden">
					<div
						className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
						style={{ width: `${pct}%` }}
					/>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs text-muted-foreground tabular-nums">
						{done ? (
							<span className="text-foreground font-medium">
								Goal reached ✓
							</span>
						) : (
							<>{goal - total} left</>
						)}
					</span>

					{editingGoal ? (
						<div className="flex items-center gap-1.5">
							<input
								ref={inputRef}
								type="number"
								value={goalInput}
								onChange={(e) => setGoalInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') commitGoal()
									if (e.key === 'Escape') setEditingGoal(false)
								}}
								className="w-20 h-6 rounded border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-foreground/40 tabular-nums"
							/>
							<button
								type="button"
								onClick={commitGoal}
								className="text-xs font-medium text-foreground hover:opacity-70 transition-opacity"
							>
								Set
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => {
								setEditingGoal(true)
								setGoalInput(String(goal))
							}}
							className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<Target size={10} strokeWidth={2} />
							{goal}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
