import { useEffect } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Rectangle,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import type { TimeChartEntry } from '../store'
import { useTimeTrackerStore } from '../store'

function formatDuration(seconds: number): string {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	if (h === 0) return `${m}m`
	return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function TimeProgressChart() {
	const data = useTimeTrackerStore((s) => s.weeklyData)
	const loading = useTimeTrackerStore((s) => s.weeklyLoading)
	const loadWeekly = useTimeTrackerStore((s) => s.loadWeekly)

	useEffect(() => {
		const controller = new AbortController()
		void loadWeekly(controller.signal)
		return () => controller.abort()
	}, [loadWeekly])

	const todayLabel = data.at(-1)?.label ?? null

	const maxHours = Math.max(...data.map((d) => d.hours), 0)
	const topTick = Math.ceil(maxHours) || 1
	const yTicks = Array.from({ length: topTick + 1 }, (_, i) => i)

	return (
		<div className="rounded-xl border border-border bg-card p-5">
			<div className="mb-4">
				<p className="text-xs font-medium tracking-wide uppercase text-muted-foreground/70">
					Work time
				</p>
				<p className="text-sm font-semibold text-foreground mt-0.5">
					Last 30 days
				</p>
			</div>

			<div className="h-40">
				{loading ? (
					<div className="h-full flex items-center justify-center">
						<span className="text-xs text-muted-foreground">Loading…</span>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={160}>
						<BarChart data={data} barCategoryGap="20%">
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
								stroke="var(--border)"
							/>
							<XAxis
								dataKey="label"
								tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
								axisLine={false}
								tickLine={false}
								interval={0}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
								axisLine={false}
								tickLine={false}
								width={28}
								ticks={yTicks}
								domain={[0, topTick]}
								tickFormatter={(v: number) => (v === 0 ? '0' : `${v}h`)}
							/>
							<Tooltip
								cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null
									const entry = payload[0].payload as TimeChartEntry
									return (
										<div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
											<p className="font-semibold text-foreground">
												{entry.label}
											</p>
											<p className="text-muted-foreground">
												{entry.totalWorkSeconds > 0
													? formatDuration(entry.totalWorkSeconds)
													: 'No sessions'}
											</p>
										</div>
									)
								}}
							/>
							<Bar
								dataKey="hours"
								// biome-ignore lint/suspicious/noExplicitAny: recharts spreads data keys into shape props but doesn't type them
								shape={(props: any) => {
									const { label, hours } = props as TimeChartEntry
									const isToday = label === todayLabel
									const fill = isToday
										? 'var(--primary)'
										: hours > 0
											? 'hsl(214 80% 56%)'
											: 'var(--muted-foreground)'
									const opacity = isToday ? 1 : hours > 0 ? 0.75 : 0.2
									return (
										<Rectangle
											{...props}
											fill={fill}
											opacity={opacity}
											radius={[3, 3, 0, 0]}
										/>
									)
								}}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>

			<div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
					Today
				</span>
				<span className="flex items-center gap-1.5">
					<span
						className="inline-block w-2.5 h-2.5 rounded-sm"
						style={{ background: 'hsl(214 80% 56%)' }}
					/>
					Work sessions
				</span>
			</div>
		</div>
	)
}
