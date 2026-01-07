/**
 * Timer Service
 * Manages the timer state and communicates with the Web Worker
 * Implements timestamp-based calculations to prevent drift
 */

export interface TimerState {
  startedAt: Date
  plannedDuration: number // seconds
  pausedAt: Date | null
  totalPausedDuration: number // seconds
  isActive: boolean
  isPaused: boolean
}

export interface RemainingTime {
  remaining: number // seconds
  elapsed: number // seconds
  progress: number // 0-100
}

export type TimerEventType = 'tick' | 'complete' | 'paused' | 'resumed' | 'started' | 'stopped'

export interface TimerEvent {
  type: TimerEventType
  remainingTime?: RemainingTime
  timestamp: number
}

export type TimerEventCallback = (event: TimerEvent) => void

/**
 * Timer Service
 * Provides accurate timestamp-based timer with Web Worker support
 */
export class TimerService {
  private worker: Worker | null = null
  private state: TimerState | null = null
  private listeners: Set<TimerEventCallback> = new Set()
  private lastTickTimestamp = 0

  constructor(private workerPath?: string) {}

  /**
   * Start a new timer session
   */
  start(plannedDuration: number): void {
    this.state = {
      startedAt: new Date(),
      plannedDuration,
      pausedAt: null,
      totalPausedDuration: 0,
      isActive: true,
      isPaused: false,
    }

    this.initWorker()
    this.worker?.postMessage({ type: 'START' })

    this.emit({
      type: 'started',
      timestamp: Date.now(),
    })
  }

  /**
   * Pause the current timer
   */
  pause(): void {
    if (!this.state || !this.state.isActive || this.state.isPaused) {
      return
    }

    this.state.pausedAt = new Date()
    this.state.isPaused = true

    this.worker?.postMessage({ type: 'STOP' })

    this.emit({
      type: 'paused',
      remainingTime: this.calculateRemainingTime(),
      timestamp: Date.now(),
    })
  }

  /**
   * Resume a paused timer
   */
  resume(): void {
    if (!this.state || !this.state.isActive || !this.state.isPaused || !this.state.pausedAt) {
      return
    }

    // Calculate pause duration and add to total
    const pauseDuration = (Date.now() - this.state.pausedAt.getTime()) / 1000
    this.state.totalPausedDuration += pauseDuration
    this.state.pausedAt = null
    this.state.isPaused = false

    this.worker?.postMessage({ type: 'START' })

    this.emit({
      type: 'resumed',
      remainingTime: this.calculateRemainingTime(),
      timestamp: Date.now(),
    })
  }

  /**
   * Stop the timer completely
   */
  stop(): void {
    this.worker?.postMessage({ type: 'STOP' })
    this.terminateWorker()

    this.emit({
      type: 'stopped',
      timestamp: Date.now(),
    })

    this.state = null
  }

  /**
   * Get current remaining time
   */
  getRemainingTime(): RemainingTime | null {
    if (!this.state) {
      return null
    }

    return this.calculateRemainingTime()
  }

  /**
   * Subscribe to timer events
   */
  on(callback: TimerEventCallback): () => void {
    this.listeners.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Check if timer is active
   */
  isActive(): boolean {
    return this.state?.isActive ?? false
  }

  /**
   * Check if timer is paused
   */
  isPaused(): boolean {
    return this.state?.isPaused ?? false
  }

  /**
   * Get current timer state
   */
  getState(): TimerState | null {
    return this.state
  }

  /**
   * Calculate remaining time based on timestamps
   */
  private calculateRemainingTime(): RemainingTime {
    if (!this.state) {
      return { remaining: 0, elapsed: 0, progress: 100 }
    }

    const now = Date.now()
    const startTime = this.state.startedAt.getTime()

    // Calculate elapsed time
    let elapsed = (now - startTime) / 1000 // Convert to seconds

    // Subtract paused duration
    elapsed -= this.state.totalPausedDuration

    // If currently paused, don't count the current pause
    if (this.state.isPaused && this.state.pausedAt) {
      elapsed -= (now - this.state.pausedAt.getTime()) / 1000
    }

    // Calculate remaining time
    const remaining = Math.max(0, this.state.plannedDuration - elapsed)

    // Calculate progress (0-100)
    const progress =
      this.state.plannedDuration > 0 ? ((this.state.plannedDuration - remaining) / this.state.plannedDuration) * 100 : 0

    return {
      remaining: Math.round(remaining),
      elapsed: Math.round(elapsed),
      progress: Math.min(100, Math.max(0, progress)),
    }
  }

  /**
   * Initialize the Web Worker
   */
  private initWorker(): void {
    if (this.worker) {
      return
    }

    try {
      // In a real Chrome extension, you'd load the worker from the extension
      // For now, we'll create an inline worker
      if (this.workerPath) {
        this.worker = new Worker(this.workerPath)
      } else {
        // Create inline worker for development
        const workerBlob = new Blob(
          [
            `
            let intervalId = null;

            self.onmessage = (event) => {
              const { type } = event.data;

              if (type === 'START') {
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(() => {
                  self.postMessage({ type: 'TICK', timestamp: Date.now() });
                }, 100);
              } else if (type === 'STOP') {
                if (intervalId) {
                  clearInterval(intervalId);
                  intervalId = null;
                }
                self.postMessage({ type: 'STOPPED', timestamp: Date.now() });
              }
            };
          `,
          ],
          { type: 'application/javascript' },
        )

        const workerUrl = URL.createObjectURL(workerBlob)
        this.worker = new Worker(workerUrl)
      }

      // Handle worker messages
      this.worker.onmessage = this.handleWorkerMessage.bind(this)

      // Handle worker errors
      this.worker.onerror = error => {
        console.error('Timer worker error:', error)
        this.terminateWorker()
      }
    } catch (error) {
      console.error('Failed to initialize timer worker:', error)
      // Fallback to main thread timer
      this.useFallbackTimer()
    }
  }

  /**
   * Handle messages from the Web Worker
   */
  private handleWorkerMessage(event: MessageEvent): void {
    const { type, timestamp } = event.data

    if (type === 'TICK') {
      this.handleTick(timestamp)
    }
  }

  /**
   * Handle timer tick
   */
  private handleTick(timestamp: number): void {
    if (!this.state || !this.state.isActive || this.state.isPaused) {
      return
    }

    // Avoid duplicate ticks
    if (timestamp === this.lastTickTimestamp) {
      return
    }

    this.lastTickTimestamp = timestamp

    const remainingTime = this.calculateRemainingTime()

    // Check if timer completed
    if (remainingTime.remaining <= 0) {
      this.handleComplete()
      return
    }

    // Emit tick event
    this.emit({
      type: 'tick',
      remainingTime,
      timestamp,
    })
  }

  /**
   * Handle timer completion
   */
  private handleComplete(): void {
    this.worker?.postMessage({ type: 'STOP' })

    this.emit({
      type: 'complete',
      remainingTime: {
        remaining: 0,
        elapsed: this.state?.plannedDuration ?? 0,
        progress: 100,
      },
      timestamp: Date.now(),
    })

    this.terminateWorker()
    this.state = null
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: TimerEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in timer event listener:', error)
      }
    })
  }

  /**
   * Terminate the Web Worker
   */
  private terminateWorker(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }

  /**
   * Fallback to main thread timer if worker fails
   */
  private useFallbackTimer(): void {
    console.warn('Using fallback timer on main thread')

    // Simple setInterval fallback
    const intervalId = setInterval(() => {
      if (!this.state?.isActive || this.state?.isPaused) {
        clearInterval(intervalId)
        return
      }

      this.handleTick(Date.now())
    }, 100)
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.stop()
    this.listeners.clear()
  }
}
