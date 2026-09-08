import { cn } from '@/shared/lib/cn.ts'

type Props = {
	checkHours: number[]
	disabled: boolean
	onChange: (checkHours: number[]) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function ScheduleEditor({ checkHours, disabled, onChange }: Props) {
	function toggle(hour: number) {
		const next = checkHours.includes(hour)
			? checkHours.filter((h) => h !== hour)
			: [...checkHours, hour]
		onChange(next)
	}

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-8 gap-1.5">
				{HOURS.map((hour) => {
					const active = checkHours.includes(hour)
					return (
						<button
							key={hour}
							type="button"
							disabled={disabled}
							onClick={() => toggle(hour)}
							aria-pressed={active}
							className={cn(
								'h-8 rounded-md text-xs font-medium border transition-colors disabled:pointer-events-none disabled:opacity-50',
								active
									? 'bg-primary text-primary-foreground border-transparent'
									: 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground',
							)}
						>
							{String(hour).padStart(2, '0')}
						</button>
					)
				})}
			</div>
			<p className="text-xs text-muted-foreground">
				{checkHours.length === 0
					? 'Automatic checks are off — use "Check now" instead.'
					: `Checked automatically at ${checkHours
							.map((h) => `${String(h).padStart(2, '0')}:00`)
							.join(', ')} (server time).`}
			</p>
		</div>
	)
}
