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
	const { data, loading, addSet, resetDay, updateGoal } = useWorkout()

	return (
		<>
			<style>{`
        @keyframes pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.12); }
          70%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .counter-pop { animation: pop 0.32s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes row-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-in { animation: row-in 0.2s ease both; }
      `}</style>

			<div className="h-full flex flex-col">
				<WorkoutHeader />

				<div className="flex-1 overflow-auto p-8">
					<div className="max-w-sm space-y-4">
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
								<QuickAddButtons onAdd={addSet} />
								<SetsLog sets={data.sets} onReset={resetDay} />
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
