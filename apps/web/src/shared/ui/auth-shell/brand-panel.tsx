import { Link } from '@tanstack/react-router'
import { Logo } from '../logo'
import { ClockArt } from './clock-art'
import { GridLines } from './grid-lines'

const GLOW =
	'radial-gradient(ellipse 60% 50% at 50% 40%, color-mix(in oklch, var(--primary) 25%, transparent), transparent)'

export function BrandPanel() {
	return (
		<div className="relative lg:w-2/5 bg-[--foreground] text-[--background] flex flex-col items-center justify-center p-10 overflow-hidden lg:min-h-screen">
			<GridLines />
			<div
				className="absolute inset-0 pointer-events-none"
				style={{ background: GLOW }}
			/>

			<div className="relative z-10 flex flex-col items-center text-center gap-8">
				<BrandLogo />
				<div className="text-[--background] hidden lg:block">
					<ClockArt />
				</div>
				<Tagline />
			</div>
		</div>
	)
}

function BrandLogo() {
	return (
		<div className="flex flex-col items-center gap-1">
			<Link
				to="/"
				aria-label="my·time home"
				className="opacity-90 hover:opacity-100 transition-opacity"
			>
				<Logo className="text-4xl" />
			</Link>
			<div
				className="h-px w-16 opacity-20"
				style={{ background: 'currentColor' }}
			/>
		</div>
	)
}

function Tagline() {
	return (
		<div className="hidden lg:flex flex-col gap-2 max-w-xs">
			<p className="text-sm opacity-50 leading-relaxed tracking-wide uppercase font-medium">
				Time, tracked precisely
			</p>
			<p className="text-xs opacity-30 leading-relaxed">
				Every minute matters. Know where yours go.
			</p>
		</div>
	)
}
