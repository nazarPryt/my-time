/**
 * Timer State Machine
 * Enforces valid timer state transitions and prevents impossible states
 * Implements state machine pattern for Pomodoro timer logic
 */

/**
 * All possible timer states
 */
export const TimerState = {
  IDLE: 'IDLE',
  WORK_ACTIVE: 'WORK_ACTIVE',
  WORK_PAUSED: 'WORK_PAUSED',
  SHORT_BREAK_ACTIVE: 'SHORT_BREAK_ACTIVE',
  SHORT_BREAK_PAUSED: 'SHORT_BREAK_PAUSED',
  LONG_BREAK_ACTIVE: 'LONG_BREAK_ACTIVE',
  LONG_BREAK_PAUSED: 'LONG_BREAK_PAUSED',
} as const

export type TimerState = (typeof TimerState)[keyof typeof TimerState]

/**
 * All possible timer events/commands
 */
export const TimerEvent = {
  START_WORK: 'START_WORK',
  START_SHORT_BREAK: 'START_SHORT_BREAK',
  START_LONG_BREAK: 'START_LONG_BREAK',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  SKIP: 'SKIP',
  COMPLETE: 'COMPLETE',
  ABANDON: 'ABANDON',
} as const

export type TimerEvent = (typeof TimerEvent)[keyof typeof TimerEvent]

/**
 * Side effect handler function type
 */
export type SideEffectHandler = () => void | Promise<void>

/**
 * State machine configuration
 */
export interface StateMachineConfig {
  // Side effects
  onEnterWorkActive?: SideEffectHandler
  onExitWorkActive?: SideEffectHandler
  onEnterWorkPaused?: SideEffectHandler
  onExitWorkPaused?: SideEffectHandler
  onEnterShortBreakActive?: SideEffectHandler
  onExitShortBreakActive?: SideEffectHandler
  onEnterShortBreakPaused?: SideEffectHandler
  onExitShortBreakPaused?: SideEffectHandler
  onEnterLongBreakActive?: SideEffectHandler
  onExitLongBreakActive?: SideEffectHandler
  onEnterLongBreakPaused?: SideEffectHandler
  onExitLongBreakPaused?: SideEffectHandler
  onEnterIdle?: SideEffectHandler
  onComplete?: SideEffectHandler
  onAbandon?: SideEffectHandler
}

/**
 * Error thrown when an invalid state transition is attempted
 */
export class InvalidStateTransitionError extends Error {
  constructor(
    public readonly fromState: TimerState,
    public readonly event: TimerEvent,
  ) {
    super(`Invalid transition: Cannot ${event} from state ${fromState}`)
    this.name = 'InvalidStateTransitionError'
  }
}

/**
 * TimerStateMachine class
 * Manages timer state and enforces valid transitions
 */
export class TimerStateMachine {
  private currentState: TimerState
  private readonly config: StateMachineConfig

  /**
   * Valid transitions map
   * Maps [currentState][event] -> nextState
   */
  private readonly transitions: Map<TimerState, Map<TimerEvent, TimerState>> = new Map([
    // IDLE state transitions
    [
      TimerState.IDLE,
      new Map([
        [TimerEvent.START_WORK, TimerState.WORK_ACTIVE],
        [TimerEvent.START_SHORT_BREAK, TimerState.SHORT_BREAK_ACTIVE],
        [TimerEvent.START_LONG_BREAK, TimerState.LONG_BREAK_ACTIVE],
      ]),
    ],
    // WORK_ACTIVE state transitions
    [
      TimerState.WORK_ACTIVE,
      new Map([
        [TimerEvent.PAUSE, TimerState.WORK_PAUSED],
        [TimerEvent.COMPLETE, TimerState.IDLE],
        [TimerEvent.SKIP, TimerState.IDLE],
        [TimerEvent.ABANDON, TimerState.IDLE],
      ]),
    ],
    // WORK_PAUSED state transitions
    [
      TimerState.WORK_PAUSED,
      new Map([
        [TimerEvent.RESUME, TimerState.WORK_ACTIVE],
        [TimerEvent.ABANDON, TimerState.IDLE],
      ]),
    ],
    // SHORT_BREAK_ACTIVE state transitions
    [
      TimerState.SHORT_BREAK_ACTIVE,
      new Map([
        [TimerEvent.PAUSE, TimerState.SHORT_BREAK_PAUSED],
        [TimerEvent.COMPLETE, TimerState.IDLE],
        [TimerEvent.SKIP, TimerState.IDLE],
      ]),
    ],
    // SHORT_BREAK_PAUSED state transitions
    [
      TimerState.SHORT_BREAK_PAUSED,
      new Map([
        [TimerEvent.RESUME, TimerState.SHORT_BREAK_ACTIVE],
        [TimerEvent.SKIP, TimerState.IDLE],
      ]),
    ],
    // LONG_BREAK_ACTIVE state transitions
    [
      TimerState.LONG_BREAK_ACTIVE,
      new Map([
        [TimerEvent.PAUSE, TimerState.LONG_BREAK_PAUSED],
        [TimerEvent.COMPLETE, TimerState.IDLE],
        [TimerEvent.SKIP, TimerState.IDLE],
      ]),
    ],
    // LONG_BREAK_PAUSED state transitions
    [
      TimerState.LONG_BREAK_PAUSED,
      new Map([
        [TimerEvent.RESUME, TimerState.LONG_BREAK_ACTIVE],
        [TimerEvent.SKIP, TimerState.IDLE],
      ]),
    ],
  ])

  constructor(initialState: TimerState = TimerState.IDLE, config: StateMachineConfig = {}) {
    this.currentState = initialState
    this.config = config
  }

  /**
   * Get the current state
   */
  getState(): TimerState {
    return this.currentState
  }

  /**
   * Check if an event can be triggered from the current state
   */
  canTransition(event: TimerEvent): boolean {
    const stateTransitions = this.transitions.get(this.currentState)
    return stateTransitions?.has(event) ?? false
  }

  /**
   * Get the next state for a given event (without transitioning)
   */
  getNextState(event: TimerEvent): TimerState | null {
    const stateTransitions = this.transitions.get(this.currentState)
    return stateTransitions?.get(event) ?? null
  }

  /**
   * Transition to a new state based on an event
   * Executes side effects and validates the transition
   */
  async transition(event: TimerEvent): Promise<TimerState> {
    const nextState = this.getNextState(event)

    if (!nextState) {
      throw new InvalidStateTransitionError(this.currentState, event)
    }

    // Execute exit side effect for current state
    await this.executeExitSideEffect(this.currentState)

    // Execute event-specific side effects
    await this.executeEventSideEffect(event)

    // Update state
    const previousState = this.currentState
    this.currentState = nextState

    // Execute entry side effect for new state
    await this.executeEntrySideEffect(this.currentState)

    return this.currentState
  }

  /**
   * Execute entry side effect for a state
   */
  private async executeEntrySideEffect(state: TimerState): Promise<void> {
    const handler = this.getEntrySideEffectHandler(state)
    if (handler) {
      await handler()
    }
  }

  /**
   * Execute exit side effect for a state
   */
  private async executeExitSideEffect(state: TimerState): Promise<void> {
    const handler = this.getExitSideEffectHandler(state)
    if (handler) {
      await handler()
    }
  }

  /**
   * Execute event-specific side effect
   */
  private async executeEventSideEffect(event: TimerEvent): Promise<void> {
    const handler = this.getEventSideEffectHandler(event)
    if (handler) {
      await handler()
    }
  }

  /**
   * Get entry side effect handler for a state
   */
  private getEntrySideEffectHandler(state: TimerState): SideEffectHandler | undefined {
    switch (state) {
      case TimerState.WORK_ACTIVE:
        return this.config.onEnterWorkActive
      case TimerState.WORK_PAUSED:
        return this.config.onEnterWorkPaused
      case TimerState.SHORT_BREAK_ACTIVE:
        return this.config.onEnterShortBreakActive
      case TimerState.SHORT_BREAK_PAUSED:
        return this.config.onEnterShortBreakPaused
      case TimerState.LONG_BREAK_ACTIVE:
        return this.config.onEnterLongBreakActive
      case TimerState.LONG_BREAK_PAUSED:
        return this.config.onEnterLongBreakPaused
      case TimerState.IDLE:
        return this.config.onEnterIdle
      default:
        return undefined
    }
  }

  /**
   * Get exit side effect handler for a state
   */
  private getExitSideEffectHandler(state: TimerState): SideEffectHandler | undefined {
    switch (state) {
      case TimerState.WORK_ACTIVE:
        return this.config.onExitWorkActive
      case TimerState.WORK_PAUSED:
        return this.config.onExitWorkPaused
      case TimerState.SHORT_BREAK_ACTIVE:
        return this.config.onExitShortBreakActive
      case TimerState.SHORT_BREAK_PAUSED:
        return this.config.onExitShortBreakPaused
      case TimerState.LONG_BREAK_ACTIVE:
        return this.config.onExitLongBreakActive
      case TimerState.LONG_BREAK_PAUSED:
        return this.config.onExitLongBreakPaused
      default:
        return undefined
    }
  }

  /**
   * Get event-specific side effect handler
   */
  private getEventSideEffectHandler(event: TimerEvent): SideEffectHandler | undefined {
    switch (event) {
      case TimerEvent.COMPLETE:
        return this.config.onComplete
      case TimerEvent.ABANDON:
        return this.config.onAbandon
      default:
        return undefined
    }
  }

  /**
   * Check if the state machine is in IDLE state
   */
  isIdle(): boolean {
    return this.currentState === TimerState.IDLE
  }

  /**
   * Check if the state machine is in an active state (not paused or idle)
   */
  isActive(): boolean {
    return [TimerState.WORK_ACTIVE, TimerState.SHORT_BREAK_ACTIVE, TimerState.LONG_BREAK_ACTIVE].includes(
      this.currentState,
    )
  }

  /**
   * Check if the state machine is in a paused state
   */
  isPaused(): boolean {
    return [TimerState.WORK_PAUSED, TimerState.SHORT_BREAK_PAUSED, TimerState.LONG_BREAK_PAUSED].includes(
      this.currentState,
    )
  }

  /**
   * Check if currently in a work session (active or paused)
   */
  isWorkSession(): boolean {
    return [TimerState.WORK_ACTIVE, TimerState.WORK_PAUSED].includes(this.currentState)
  }

  /**
   * Check if currently in a break session (active or paused)
   */
  isBreakSession(): boolean {
    return [
      TimerState.SHORT_BREAK_ACTIVE,
      TimerState.SHORT_BREAK_PAUSED,
      TimerState.LONG_BREAK_ACTIVE,
      TimerState.LONG_BREAK_PAUSED,
    ].includes(this.currentState)
  }

  /**
   * Get human-readable state description
   */
  getStateDescription(): string {
    switch (this.currentState) {
      case TimerState.IDLE:
        return 'Ready to start'
      case TimerState.WORK_ACTIVE:
        return 'Work session in progress'
      case TimerState.WORK_PAUSED:
        return 'Work session paused'
      case TimerState.SHORT_BREAK_ACTIVE:
        return 'Short break in progress'
      case TimerState.SHORT_BREAK_PAUSED:
        return 'Short break paused'
      case TimerState.LONG_BREAK_ACTIVE:
        return 'Long break in progress'
      case TimerState.LONG_BREAK_PAUSED:
        return 'Long break paused'
    }
  }

  /**
   * Get all valid events for the current state
   */
  getValidEvents(): TimerEvent[] {
    const stateTransitions = this.transitions.get(this.currentState)
    return stateTransitions ? Array.from(stateTransitions.keys()) : []
  }

  /**
   * Reset the state machine to IDLE
   */
  reset(): void {
    this.currentState = TimerState.IDLE
  }
}
