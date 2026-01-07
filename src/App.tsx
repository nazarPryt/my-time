import { Timer, TimerControls, SessionInfo, TimerProgress, TodaySummary } from '@presentation/components'
import { Card, CardContent } from '@/components/ui/card'
import { useTimerTick } from '@presentation/hooks'

function App() {
  // Set up timer ticking
  useTimerTick()

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused and productive</p>
        </header>

        {/* Main Timer Card */}
        <Card className="shadow-lg">
          <CardContent className="space-y-6 p-8">
            {/* Session Info */}
            <SessionInfo />

            {/* Timer Display */}
            <Timer />

            {/* Progress Bar */}
            <TimerProgress />

            {/* Timer Controls */}
            <TimerControls />
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <TodaySummary />
      </div>
    </div>
  )
}

export default App
