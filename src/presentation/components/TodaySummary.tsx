import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTodaySessions } from '@presentation/hooks'
import { Clock, Target, TrendingUp } from 'lucide-react'

/**
 * Today's Summary Component
 *
 * Displays a summary of today's session statistics
 */
export function TodaySummary() {
  const { pomodoroCount, todayWorkTime, dailyGoalProgress, completionRate } = useTodaySessions()

  // Format work time as hours and minutes
  const formatWorkTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today&apos;s Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pomodoro Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Pomodoros</span>
          </div>
          <span className="text-2xl font-bold">{pomodoroCount}</span>
        </div>

        {/* Work Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Focus Time</span>
          </div>
          <span className="text-2xl font-bold">{formatWorkTime(todayWorkTime)}</span>
        </div>

        {/* Daily Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Daily Goal</span>
            </div>
            <span className="text-muted-foreground text-sm">{Math.round(dailyGoalProgress)}%</span>
          </div>
          <Progress value={dailyGoalProgress} className="h-2" />
        </div>

        {/* Completion Rate */}
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground text-sm">Completion Rate</span>
          <span className="text-sm font-semibold">{Math.round(completionRate)}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
