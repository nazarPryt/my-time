import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface AuthShellProps {
	children: ReactNode
	title: string
	description: string
	footer: ReactNode
	side?: 'left' | 'right'
}

function ClockArt() {
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

const GRID_V = Array.from({ length: 12 }, (_, i) => i)
const GRID_H = Array.from({ length: 20 }, (_, i) => i)

function GridLines() {
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

export function AuthShell({
	children,
	title,
	description,
	footer,
}: AuthShellProps) {
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Brand panel */}
			<div className="relative lg:w-2/5 bg-[--foreground] text-[--background] flex flex-col items-center justify-center p-10 overflow-hidden lg:min-h-screen">
				<GridLines />

				{/* Radial glow */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							'radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in oklch, var(--primary) 25%, transparent), transparent)',
					}}
				/>

				<div className="relative z-10 flex flex-col items-center text-center gap-8">
					{/* Wordmark */}
					<div className="flex flex-col items-center gap-1">
						<Link
							to="/"
							className="text-4xl font-bold tracking-tight opacity-90 hover:opacity-100 transition-opacity"
							style={{ letterSpacing: '-0.04em' }}
						>
							my·time
						</Link>
						<div
							className="h-px w-16 opacity-20"
							style={{ background: 'currentColor' }}
						/>
					</div>

					{/* Clock art */}
					<div className="text-[--background] hidden lg:block">
						<ClockArt />
					</div>

					{/* Tagline */}
					<div className="hidden lg:flex flex-col gap-2 max-w-xs">
						<p className="text-sm opacity-50 leading-relaxed tracking-wide uppercase font-medium">
							Time, tracked precisely
						</p>
						<p className="text-xs opacity-30 leading-relaxed">
							Every minute matters. Know where yours go.
						</p>
					</div>
				</div>
			</div>

			{/* Form panel */}
			<div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
				<div className="w-full max-w-sm">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							{title}
						</h1>
						<p className="mt-1.5 text-sm text-muted-foreground">
							{description}
						</p>
					</div>

					{/* Form */}
					<div>{children}</div>

					{/* Footer */}
					<div className="mt-6 text-center text-sm text-muted-foreground">
						{footer}
					</div>
				</div>
			</div>
		</div>
	)
}
