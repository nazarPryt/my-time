import { Badge } from '@/components/ui/badge'
import { useTimer, useTodaySessions } from '@presentation/hooks'
import { TimerState } from '@domain/services'

/**
 * Session Info Component
 *
 * Displays current session type and pomodoro count
 */
export function SessionInfo() {
  const { currentSession, timerState } = useTimer()
  const { pomodoroCount } = useTodaySessions()

  // Get session type display
  const getSessionTypeDisplay = () => {
    if (!currentSession) return 'Ready to focus'

    switch (currentSession.sessionType) {
      case 'work':
        return 'Focus Session'
      case 'short_break':
        return 'Short Break'
      case 'long_break':
        return 'Long Break'
      default:
        return 'Session'
    }
  }

  // Get status badge variant
  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (timerState === TimerState.IDLE) return 'outline'
    if (
      timerState === TimerState.WORK_PAUSED ||
      timerState === TimerState.SHORT_BREAK_PAUSED ||
      timerState === TimerState.LONG_BREAK_PAUSED
    )
      return 'secondary'
    return 'default'
  }

  // Get status text
  const getStatusText = () => {
    if (timerState === TimerState.IDLE) return 'Idle'
    if (
      timerState === TimerState.WORK_PAUSED ||
      timerState === TimerState.SHORT_BREAK_PAUSED ||
      timerState === TimerState.LONG_BREAK_PAUSED
    )
      return 'Paused'
    return 'Active'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">{getSessionTypeDisplay()}</h2>
        <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
      </div>
      <p className="text-muted-foreground text-sm">{pomodoroCount} pomodoros completed today</p>
    </div>
  )
}
