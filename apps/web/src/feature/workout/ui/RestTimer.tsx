const PRESETS = [30, 60, 90, 120, 180] as const

function presetLabel(s: number) {
	if (s < 60) return `${s}s`
	if (s % 60 === 0) return `${s / 60}m`
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

function formatElapsed(seconds: number) {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${m}:${s.toString().padStart(2, '0')}`
}

const R = 44
const CIRCUMFERENCE = 2 * Math.PI * R

interface RestTimerProps {
	active: boolean
	done: boolean
	elapsed: number
	progress: number
	targetSeconds: number
	onTargetChange: (s: number) => void
}

export function RestTimer({
	active,
	done,
	elapsed,
	progress,
	targetSeconds,
	onTargetChange,
}: RestTimerProps) {
	const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

	return (
		<div className="rounded-xl border border-border bg-card p-5">
			<span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/60">
				Rest timer
			</span>

			{active && (
				<div className="flex justify-center mt-4 mb-3">
					<div className="relative w-28 h-28">
						<svg width="112" height="112" viewBox="0 0 112 112">
							<circle
								cx="56"
								cy="56"
								r={R}
								fill="none"
								strokeWidth="6"
								className="stroke-muted"
							/>
							<circle
								cx="56"
								cy="56"
								r={R}
								fill="none"
								strokeWidth="6"
								strokeLinecap="round"
								strokeDasharray={CIRCUMFERENCE}
								strokeDashoffset={strokeDashoffset}
								transform="rotate(-90 56 56)"
								className="stroke-primary transition-[stroke-dashoffset] duration-500"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							{done ? (
								<span key="go" className="go-flash text-2xl font-bold text-primary select-none">
									GO!!!
								</span>
							) : (
								<span className="text-xl font-bold tabular-nums text-foreground">
									{formatElapsed(elapsed)}
								</span>
							)}
						</div>
					</div>
				</div>
			)}

			<div className={`flex gap-1.5 justify-center flex-wrap ${active ? '' : 'mt-3'}`}>
				{PRESETS.map((s) => (
					<button
						key={s}
						type="button"
						onClick={() => onTargetChange(s)}
						className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
							targetSeconds === s
								? 'bg-primary text-primary-foreground border-primary'
								: 'border-border text-muted-foreground hover:bg-muted'
						}`}
					>
						{presetLabel(s)}
					</button>
				))}
			</div>
		</div>
	)
}