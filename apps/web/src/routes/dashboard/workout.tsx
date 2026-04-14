import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useWorkoutStore } from '@/feature/workout/store'
import {
	HeroCounter,
	QuickAddButtons,
	SetsLog,
	WorkoutHeader,
} from '@/feature/workout/ui'

export const Route = createFileRoute('/dashboard/workout')({
	component: WorkoutPage,
})

function WorkoutPage() {
	const {
		data,
		loading,
		submitting,
		addSet,
		deleteSet,
		resetDay,
		updateGoal,
		load,
	} = useWorkoutStore()

	useEffect(() => {
		const controller = new AbortController()
		void load(controller.signal)
		return () => controller.abort()
	}, [load])

	return (
		<div data-testid="workout-page" className="h-full flex flex-col">
			<WorkoutHeader />

			<div className="flex-1 overflow-auto p-8">
				<div className="max-w-sm mx-auto space-y-4">
					{loading || !data ? (
						<div data-testid="workout-loading" className="rounded-xl border border-border bg-card p-7 flex items-center justify-center h-48">
							<span className="text-xs text-muted-foreground">Loading…</span>
						</div>
					) : (
						<>
							<HeroCounter
								total={data.total}
								goal={data.goal.targetReps}
								onGoalChange={updateGoal}
							/>
							<QuickAddButtons onAdd={addSet} disabled={submitting} />
							<SetsLog
								sets={data.sets}
								onDelete={deleteSet}
								onReset={resetDay}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
