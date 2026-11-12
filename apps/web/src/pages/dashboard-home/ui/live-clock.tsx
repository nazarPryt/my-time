import { format } from 'date-fns'
import { useEffect, useState } from 'react'

export function LiveClock() {
	const [time, setTime] = useState(() => new Date())

	useEffect(() => {
		const id = setInterval(() => setTime(new Date()), 1000)
		return () => clearInterval(id)
	}, [])

	const hh = format(time, 'HH')
	const mm = format(time, 'mm')
	const ss = format(time, 'ss')

	return (
		<div className="flex items-baseline gap-1 select-none" aria-live="off">
			<span className="text-[56px] font-bold tracking-[-0.05em] tabular-nums text-foreground leading-none">
				{hh}
				<span className="text-foreground/20 mx-0.5">:</span>
				{mm}
			</span>
			<span className="text-2xl font-medium tabular-nums text-foreground/35 tracking-tight leading-none mb-0.5">
				:{ss}
			</span>
		</div>
	)
}
