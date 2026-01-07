import { Button } from '@/components/ui/button'
import { useTimer, useTimerControls, useSettings } from '@presentation/hooks'
import { TimerState } from '@domain/services'
import { Play, Pause, Square, Coffee, Sparkles } from 'lucide-react'

/**
 * Timer Controls Component
 *
 * Provides buttons to control the timer (start, pause, resume, complete, abandon)
 */
export function TimerControls() {
  const { timerState, currentSession } = useTimer()
  const { startWork, startShortBreak, startLongBreak, pause, resume, complete, abandon } = useTimerControls()
  const { settings } = useSettings()

  const isIdle = timerState === TimerState.IDLE
  const isPaused =
    timerState === TimerState.WORK_PAUSED ||
    timerState === TimerState.SHORT_BREAK_PAUSED ||
    timerState === TimerState.LONG_BREAK_PAUSED
  const isActive =
    timerState === TimerState.WORK_ACTIVE ||
    timerState === TimerState.SHORT_BREAK_ACTIVE ||
    timerState === TimerState.LONG_BREAK_ACTIVE

  // Show start buttons when idle
  if (isIdle) {
    return (
      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={() => startWork()} className="w-full gap-2 text-lg">
          <Play className="h-5 w-5" />
          Start Focus Session
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => startShortBreak()} className="flex-1 gap-2">
            <Coffee className="h-4 w-4" />
            Short Break
          </Button>
          <Button size="sm" variant="outline" onClick={() => startLongBreak()} className="flex-1 gap-2">
            <Sparkles className="h-4 w-4" />
            Long Break
          </Button>
        </div>
      </div>
    )
  }

  // Show pause/resume and stop buttons when active or paused
  return (
    <div className="flex gap-2">
      {isActive && (
        <Button size="lg" variant="secondary" onClick={pause} className="flex-1 gap-2">
          <Pause className="h-5 w-5" />
          Pause
        </Button>
      )}
      {isPaused && (
        <Button size="lg" onClick={resume} className="flex-1 gap-2">
          <Play className="h-5 w-5" />
          Resume
        </Button>
      )}
      <Button size="lg" variant="outline" onClick={complete} className="flex-1 gap-2">
        <Square className="h-5 w-5" />
        Complete
      </Button>
      <Button size="lg" variant="destructive" onClick={abandon} className="flex-1 gap-2">
        <Square className="h-5 w-5" />
        Stop
      </Button>
    </div>
  )
}
