import { useEffect } from 'react'
import {
	HeroCounter,
	QuickAddButtons,
	RestTimer,
	SetsLog,
	useRestTimer,
	useWorkoutStore,
	WORKOUT_TEST_IDS,
	WorkoutHeader,
	WorkoutSkeleton,
} from '@/features/workout'

export function WorkoutPage() {
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

	const restTimer = useRestTimer()

	useEffect(() => {
		const controller = new AbortController()
		void load(controller.signal)
		return () => controller.abort()
	}, [load])

	const handleAddSet = (reps: number) => {
		void addSet(reps)
		restTimer.start()
	}

	return (
		<div data-testid={WORKOUT_TEST_IDS.page} className="h-full flex flex-col">
			<WorkoutHeader />

			<div className="flex-1 overflow-auto p-4 sm:p-8">
				<div className="max-w-sm mx-auto space-y-4">
					{loading || !data ? (
						<WorkoutSkeleton />
					) : (
						<>
							<HeroCounter
								total={data.total}
								goal={data.goal.targetReps}
								onGoalChange={updateGoal}
							/>
							<QuickAddButtons onAdd={handleAddSet} disabled={submitting} />
							<RestTimer
								active={restTimer.active}
								done={restTimer.done}
								elapsed={restTimer.elapsed}
								progress={restTimer.progress}
								targetSeconds={restTimer.targetSeconds}
								onTargetChange={restTimer.changeTarget}
							/>
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
