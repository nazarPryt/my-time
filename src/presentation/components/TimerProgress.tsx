import { Progress } from '@/components/ui/progress'
import { useTimer } from '@presentation/hooks'

/**
 * Timer Progress Component
 *
 * Visual progress bar showing timer completion
 */
export function TimerProgress() {
  const { progress } = useTimer()

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-muted-foreground text-center text-xs">{Math.round(progress)}% complete</p>
    </div>
  )
}
