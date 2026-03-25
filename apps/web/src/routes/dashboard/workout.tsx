import { createFileRoute } from '@tanstack/react-router'
import { useWorkout } from '@/feature/workout'
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
	const { data, loading, submitting, addSet, deleteSet, resetDay, updateGoal } =
		useWorkout()

	return (
		<div className="h-full flex flex-col">
			<WorkoutHeader />

			<div className="flex-1 overflow-auto p-8">
				<div className="max-w-sm mx-auto space-y-4">
					{loading || !data ? (
						<div className="rounded-xl border border-border bg-card p-7 flex items-center justify-center h-48">
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
