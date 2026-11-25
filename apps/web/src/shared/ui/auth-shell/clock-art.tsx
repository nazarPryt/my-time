export function ClockArt() {
	const ticks = Array.from({ length: 60 }, (_, i) => i)
	const cx = 160
	const cy = 160
	const r = 130

	return (
		<svg
			viewBox="0 0 320 320"
			className="w-72 h-72 opacity-20"
			aria-hidden="true"
		>
			{/* Outer circle */}
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke="currentColor"
				strokeWidth="0.5"
			/>

			{/* Inner circle */}
			<circle
				cx={cx}
				cy={cy}
				r={r * 0.85}
				fill="none"
				stroke="currentColor"
				strokeWidth="0.3"
				strokeDasharray="2 4"
			/>

			{/* Tick marks */}
			{ticks.map((i) => {
				const angle = ((i * 360) / 60) * (Math.PI / 180) - Math.PI / 2
				const isHour = i % 5 === 0
				const innerR = isHour ? r * 0.88 : r * 0.94
				const x1 = cx + innerR * Math.cos(angle)
				const y1 = cy + innerR * Math.sin(angle)
				const x2 = cx + r * Math.cos(angle)
				const y2 = cy + r * Math.sin(angle)
				return (
					<line
						key={i}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						stroke="currentColor"
						strokeWidth={isHour ? 1.5 : 0.5}
						strokeLinecap="round"
					/>
				)
			})}

			{/* Hour hand — pointing ~10 */}
			<line
				x1={cx}
				y1={cy}
				x2={cx + r * 0.55 * Math.cos((-60 * Math.PI) / 180 - Math.PI / 2)}
				y2={cy + r * 0.55 * Math.sin((-60 * Math.PI) / 180 - Math.PI / 2)}
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>

			{/* Minute hand — pointing ~2 */}
			<line
				x1={cx}
				y1={cy}
				x2={cx + r * 0.75 * Math.cos((60 * Math.PI) / 180 - Math.PI / 2)}
				y2={cy + r * 0.75 * Math.sin((60 * Math.PI) / 180 - Math.PI / 2)}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>

			{/* Center dot */}
			<circle cx={cx} cy={cy} r={3} fill="currentColor" />
		</svg>
	)
}
