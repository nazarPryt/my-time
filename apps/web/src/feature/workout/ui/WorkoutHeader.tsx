import { format } from 'date-fns'
import { Dumbbell } from 'lucide-react'

export function WorkoutHeader() {
	return (
		<header data-testid="workout-header" className="h-14 flex items-center px-8 border-b border-border shrink-0 gap-2.5">
			<Dumbbell
				size={15}
				strokeWidth={1.75}
				className="text-muted-foreground"
			/>
			<h1 className="text-sm font-semibold text-foreground tracking-tight">
				Workout
			</h1>
			<span data-testid="workout-date" className="ml-auto text-xs text-muted-foreground">
				{format(new Date(), 'EEEE, MMMM d')}
			</span>
		</header>
	)
}
