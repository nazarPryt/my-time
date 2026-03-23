import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard/')({
	component: DashboardHome,
})

function LiveClock() {
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

function StatCard({
	label,
	value,
	sub,
}: {
	label: string
	value: string
	sub?: string
}) {
	return (
		<div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-1">
			<span className="text-xs font-medium tracking-wide uppercase text-muted-foreground/70">
				{label}
			</span>
			<span className="text-2xl font-bold tracking-tight text-foreground">
				{value}
			</span>
			{sub && <span className="text-xs text-muted-foreground">{sub}</span>}
		</div>
	)
}

function DashboardHome() {
	const today = format(new Date(), 'EEEE, MMMM d')

	return (
		<div className="h-full flex flex-col">
			{/* Page header */}
			<header className="h-14 flex items-center px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground tracking-tight">
					Overview
				</h1>
				<span className="ml-3 text-xs text-muted-foreground">{today}</span>
			</header>

			{/* Content */}
			<div className="flex-1 overflow-auto p-8">
				{/* Clock hero */}
				<div className="mb-10">
					<LiveClock />
					<p className="mt-2 text-sm text-muted-foreground">
						Start tracking to see where your time goes.
					</p>
				</div>

				{/* Stat grid */}
				<div className="grid grid-cols-3 gap-4 max-w-xl">
					<StatCard label="Today" value="0h 00m" sub="No entries yet" />
					<StatCard label="This week" value="0h 00m" sub="Goal: 40h" />
					<StatCard label="Projects" value="0" sub="None active" />
				</div>
			</div>
		</div>
	)
}
