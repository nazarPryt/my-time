const GRID_V = Array.from({ length: 12 }, (_, i) => i)
const GRID_H = Array.from({ length: 20 }, (_, i) => i)

export function GridLines() {
	return (
		<svg
			viewBox="0 0 400 600"
			className="absolute inset-0 w-full h-full opacity-[0.04]"
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			{GRID_V.map((i) => (
				<line
					key={`v-${i}`}
					x1={(i / 11) * 400}
					y1="0"
					x2={(i / 11) * 400}
					y2="600"
					stroke="white"
					strokeWidth="0.5"
				/>
			))}
			{GRID_H.map((i) => (
				<line
					key={`h-${i}`}
					x1="0"
					y1={(i / 19) * 600}
					x2="400"
					y2={(i / 19) * 600}
					stroke="white"
					strokeWidth="0.5"
				/>
			))}
		</svg>
	)
}
