import { useTimer } from '@presentation/hooks'

/**
 * Timer Component
 *
 * Displays the countdown timer in large, readable format
 */
export function Timer() {
  const { formattedTime, currentSession } = useTimer()

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-muted-foreground text-8xl font-bold">25:00</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-8xl font-bold tracking-tight tabular-nums">{formattedTime}</div>
    </div>
  )
}
