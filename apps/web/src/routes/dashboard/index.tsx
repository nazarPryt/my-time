import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { LiveClock, StatCard } from '@/feature/dashboard/ui'
import { TimeProgressChart } from '@/feature/time-tracker/ui'
import { WorkoutProgressChart } from '@/feature/workout/ui'

export const Route = createFileRoute('/dashboard/')({
	component: DashboardHome,
})

function DashboardHome() {
	const today = format(new Date(), 'EEEE, MMMM d')

	return (
		<div data-testid="dashboard-home" className="h-full flex flex-col">
			<header className="h-14 flex items-center px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground tracking-tight">
					Overview
				</h1>
				<span className="ml-3 text-xs text-muted-foreground">{today}</span>
			</header>

			<div className="flex-1 overflow-auto p-8">
				<div className="mb-10">
					<LiveClock />
					<p className="mt-2 text-sm text-muted-foreground">
						Start tracking to see where your time goes.
					</p>
				</div>

				<div className="grid grid-cols-3 gap-4 max-w-xl mb-8">
					<StatCard label="Today" value="0h 00m" sub="No entries yet" />
					<StatCard label="This week" value="0h 00m" sub="Goal: 40h" />
					<StatCard label="Projects" value="0" sub="None active" />
				</div>

				<div className="w-full flex flex-col gap-6">
					<TimeProgressChart />
					<WorkoutProgressChart />
				</div>
			</div>
		</div>
	)
}
