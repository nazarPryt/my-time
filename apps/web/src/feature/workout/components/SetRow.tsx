import type { SetResponse } from 'contracts'
import { format } from 'date-fns'

interface SetRowProps {
	set: SetResponse
	animate?: boolean
}

export function SetRow({ set, animate }: SetRowProps) {
	return (
		<div
			className={`flex items-center justify-between px-5 py-2.5 ${animate ? 'row-in' : ''}`}
		>
			<span className="text-xs text-muted-foreground/70 tabular-nums">
				{format(new Date(set.createdAt), 'HH:mm')}
			</span>
			<span className="text-sm font-semibold tabular-nums text-foreground">
				+{set.reps}
			</span>
		</div>
	)
}