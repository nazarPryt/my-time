/**
 * Timer Worker
 * Runs in a Web Worker for accurate timing independent of main thread
 *
 * This worker implements a timestamp-based timer that:
 * - Ticks every 100ms
 * - Sends tick events to the main thread
 * - Prevents drift by using timestamps instead of counters
 */

interface TimerState {
  isRunning: boolean
  intervalId: number | null
}

const state: TimerState = {
  isRunning: false,
  intervalId: null,
}

/**
 * Message types from main thread
 */
type WorkerMessage = { type: 'START' } | { type: 'STOP' } | { type: 'PING' }

/**
 * Start the timer
 */
function startTimer() {
  if (state.isRunning) {
    return
  }

  state.isRunning = true

  // Tick every 100ms for smooth UI updates
  state.intervalId = self.setInterval(() => {
    // Send tick event to main thread with current timestamp
    self.postMessage({
      type: 'TICK',
      timestamp: Date.now(),
    })
  }, 100) as unknown as number
}

/**
 * Stop the timer
 */
function stopTimer() {
  if (!state.isRunning) {
    return
  }

  if (state.intervalId !== null) {
    self.clearInterval(state.intervalId)
    state.intervalId = null
  }

  state.isRunning = false

  self.postMessage({
    type: 'STOPPED',
    timestamp: Date.now(),
  })
}

/**
 * Handle messages from main thread
 */
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data

  switch (type) {
    case 'START':
      startTimer()
      break

    case 'STOP':
      stopTimer()
      break

    case 'PING':
      // Respond to health check
      self.postMessage({
        type: 'PONG',
        timestamp: Date.now(),
        isRunning: state.isRunning,
      })
      break

    default:
      console.warn('Unknown message type:', type)
  }
}

// Export empty object for TypeScript
export {}
