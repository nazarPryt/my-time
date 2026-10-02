import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Rectangle,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import type { ChartEntry } from '../model/store'
import { useWorkoutStore } from '../model/store'
import { WORKOUT_TEST_IDS } from '../testIds'

export function WorkoutProgressChart() {
	const {
		progressData: data,
		progressLoading: loading,
		goalReps,
		cursor,
		prevMonth,
		nextMonth,
		loadProgress,
	} = useWorkoutStore()

	const now = new Date()
	const year = cursor.getFullYear()
	const month = cursor.getMonth() + 1
	const monthLabel = format(cursor, 'MMMM yyyy')
	const isCurrentMonth =
		cursor.getFullYear() === now.getFullYear() &&
		cursor.getMonth() === now.getMonth()
	const todayDay = isCurrentMonth ? String(now.getDate()) : null

	useEffect(() => {
		void loadProgress(year, month)
	}, [loadProgress, year, month])

	const totalReps = data.reduce((sum, d) => sum + d.total, 0)
	const goalDays =
		goalReps > 0 ? data.filter((d) => d.total >= goalReps).length : 0

	return (
		<div
			data-testid={WORKOUT_TEST_IDS.progressChart}
			className="rounded-xl border border-border bg-card p-5"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-xs font-medium tracking-wide uppercase text-muted-foreground/70">
						Push-ups
					</p>
					<p
						data-testid={WORKOUT_TEST_IDS.chartMonthLabel}
						className="text-sm font-semibold text-foreground mt-0.5"
					>
						{monthLabel}
					</p>
					{!loading && totalReps > 0 && (
						<p className="text-xs text-muted-foreground mt-1">
							{totalReps} reps · goal hit {goalDays} of {data.length} days
						</p>
					)}
				</div>
				<div className="flex items-center gap-1">
					<button
						data-testid={WORKOUT_TEST_IDS.prevMonthBtn}
						type="button"
						onClick={prevMonth}
						className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
					>
						<ChevronLeft size={16} />
					</button>
					<button
						data-testid={WORKOUT_TEST_IDS.nextMonthBtn}
						type="button"
						onClick={nextMonth}
						disabled={isCurrentMonth}
						className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
					>
						<ChevronRight size={16} />
					</button>
				</div>
			</div>

			{/* Chart */}
			<div className="h-40">
				{loading ? (
					<div
						data-testid={WORKOUT_TEST_IDS.chartLoading}
						className="h-full flex items-center justify-center"
					>
						<span className="text-xs text-muted-foreground">Loading…</span>
					</div>
				) : totalReps === 0 ? (
					<div className="h-full flex items-center justify-center">
						<span className="text-xs text-muted-foreground">
							No push-ups logged in {monthLabel}
						</span>
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
								dataKey="day"
								tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
								axisLine={false}
								tickLine={false}
								interval="preserveStartEnd"
								minTickGap={12}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
								axisLine={false}
								tickLine={false}
								width={30}
								domain={[0, (dataMax: number) => Math.max(dataMax, goalReps)]}
							/>
							{goalReps > 0 && (
								<ReferenceLine
									y={goalReps}
									stroke="hsl(142 71% 45%)"
									strokeDasharray="4 4"
									strokeOpacity={0.8}
								/>
							)}
							<Tooltip
								cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null
									const entry = payload[0].payload as ChartEntry
									return (
										<div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
											<p className="font-semibold text-foreground">
												{entry.date}
											</p>
											<p className="text-muted-foreground">
												{entry.total} reps
												{entry.total >= goalReps && (
													<span className="ml-1 text-green-500">✓ goal</span>
												)}
											</p>
										</div>
									)
								}}
							/>
							<Bar
								dataKey="total"
								// biome-ignore lint/suspicious/noExplicitAny: recharts spreads data keys into shape props but doesn't type them
								shape={(props: any) => {
									const { day, total } = props as ChartEntry
									const fill =
										day === todayDay
											? 'var(--primary)'
											: total >= goalReps
												? 'hsl(142 71% 45%)'
												: 'var(--muted-foreground)'
									const opacity = day === todayDay ? 1 : total > 0 ? 0.75 : 0.2
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

			{/* Legend */}
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
				<span className="flex items-center gap-1.5">
					<span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
					Today
				</span>
				<span className="flex items-center gap-1.5">
					<span
						className="inline-block w-2.5 h-2.5 rounded-sm"
						style={{ background: 'hsl(142 71% 45%)' }}
					/>
					Goal reached
				</span>
				<span className="flex items-center gap-1.5">
					<span
						className="inline-block w-3 border-t border-dashed"
						style={{ borderColor: 'hsl(142 71% 45%)' }}
					/>
					Goal: {goalReps} reps
				</span>
			</div>
		</div>
	)
}
