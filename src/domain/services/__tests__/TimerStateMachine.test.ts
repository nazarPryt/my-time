import { describe, it, expect, vi } from 'vitest'
import { TimerStateMachine, TimerState, TimerEvent, InvalidStateTransitionError } from '../TimerStateMachine'

describe('TimerStateMachine', () => {
  describe('initial state', () => {
    it('should start in IDLE state by default', () => {
      const machine = new TimerStateMachine()
      expect(machine.getState()).toBe(TimerState.IDLE)
    })

    it('should start in specified initial state', () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      expect(machine.getState()).toBe(TimerState.WORK_ACTIVE)
    })
  })

  describe('valid transitions from IDLE', () => {
    it('should transition from IDLE to WORK_ACTIVE', async () => {
      const machine = new TimerStateMachine()
      await machine.transition(TimerEvent.START_WORK)
      expect(machine.getState()).toBe(TimerState.WORK_ACTIVE)
    })

    it('should transition from IDLE to SHORT_BREAK_ACTIVE', async () => {
      const machine = new TimerStateMachine()
      await machine.transition(TimerEvent.START_SHORT_BREAK)
      expect(machine.getState()).toBe(TimerState.SHORT_BREAK_ACTIVE)
    })

    it('should transition from IDLE to LONG_BREAK_ACTIVE', async () => {
      const machine = new TimerStateMachine()
      await machine.transition(TimerEvent.START_LONG_BREAK)
      expect(machine.getState()).toBe(TimerState.LONG_BREAK_ACTIVE)
    })
  })

  describe('valid transitions from WORK_ACTIVE', () => {
    it('should transition from WORK_ACTIVE to WORK_PAUSED', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await machine.transition(TimerEvent.PAUSE)
      expect(machine.getState()).toBe(TimerState.WORK_PAUSED)
    })

    it('should transition from WORK_ACTIVE to IDLE on COMPLETE', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await machine.transition(TimerEvent.COMPLETE)
      expect(machine.getState()).toBe(TimerState.IDLE)
    })

    it('should transition from WORK_ACTIVE to IDLE on SKIP', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await machine.transition(TimerEvent.SKIP)
      expect(machine.getState()).toBe(TimerState.IDLE)
    })

    it('should transition from WORK_ACTIVE to IDLE on ABANDON', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await machine.transition(TimerEvent.ABANDON)
      expect(machine.getState()).toBe(TimerState.IDLE)
    })
  })

  describe('valid transitions from WORK_PAUSED', () => {
    it('should transition from WORK_PAUSED to WORK_ACTIVE on RESUME', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_PAUSED)
      await machine.transition(TimerEvent.RESUME)
      expect(machine.getState()).toBe(TimerState.WORK_ACTIVE)
    })

    it('should transition from WORK_PAUSED to IDLE on ABANDON', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_PAUSED)
      await machine.transition(TimerEvent.ABANDON)
      expect(machine.getState()).toBe(TimerState.IDLE)
    })
  })

  describe('invalid transitions', () => {
    it('should throw error for invalid transition from IDLE', async () => {
      const machine = new TimerStateMachine()
      await expect(machine.transition(TimerEvent.PAUSE)).rejects.toThrow(InvalidStateTransitionError)
    })

    it('should throw error for invalid transition from WORK_ACTIVE', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await expect(machine.transition(TimerEvent.START_WORK)).rejects.toThrow(InvalidStateTransitionError)
    })

    it('should throw error for RESUME from WORK_ACTIVE', async () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      await expect(machine.transition(TimerEvent.RESUME)).rejects.toThrow(InvalidStateTransitionError)
    })

    it('should throw error for COMPLETE from IDLE', async () => {
      const machine = new TimerStateMachine()
      await expect(machine.transition(TimerEvent.COMPLETE)).rejects.toThrow(InvalidStateTransitionError)
    })
  })

  describe('canTransition', () => {
    it('should return true for valid transitions', () => {
      const machine = new TimerStateMachine()
      expect(machine.canTransition(TimerEvent.START_WORK)).toBe(true)
      expect(machine.canTransition(TimerEvent.START_SHORT_BREAK)).toBe(true)
    })

    it('should return false for invalid transitions', () => {
      const machine = new TimerStateMachine()
      expect(machine.canTransition(TimerEvent.PAUSE)).toBe(false)
      expect(machine.canTransition(TimerEvent.RESUME)).toBe(false)
    })
  })

  describe('getNextState', () => {
    it('should return next state for valid transition', () => {
      const machine = new TimerStateMachine()
      expect(machine.getNextState(TimerEvent.START_WORK)).toBe(TimerState.WORK_ACTIVE)
    })

    it('should return null for invalid transition', () => {
      const machine = new TimerStateMachine()
      expect(machine.getNextState(TimerEvent.PAUSE)).toBeNull()
    })
  })

  describe('state queries', () => {
    it('should correctly identify IDLE state', () => {
      const machine = new TimerStateMachine()
      expect(machine.isIdle()).toBe(true)
      expect(machine.isActive()).toBe(false)
      expect(machine.isPaused()).toBe(false)
    })

    it('should correctly identify active states', () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      expect(machine.isIdle()).toBe(false)
      expect(machine.isActive()).toBe(true)
      expect(machine.isPaused()).toBe(false)
    })

    it('should correctly identify paused states', () => {
      const machine = new TimerStateMachine(TimerState.WORK_PAUSED)
      expect(machine.isIdle()).toBe(false)
      expect(machine.isActive()).toBe(false)
      expect(machine.isPaused()).toBe(true)
    })

    it('should correctly identify work session', () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      expect(machine.isWorkSession()).toBe(true)
      expect(machine.isBreakSession()).toBe(false)
    })

    it('should correctly identify break session', () => {
      const machine = new TimerStateMachine(TimerState.SHORT_BREAK_ACTIVE)
      expect(machine.isWorkSession()).toBe(false)
      expect(machine.isBreakSession()).toBe(true)
    })
  })

  describe('side effects', () => {
    it('should execute entry side effect on transition', async () => {
      const onEnter = vi.fn()
      const machine = new TimerStateMachine(TimerState.IDLE, {
        onEnterWorkActive: onEnter,
      })

      await machine.transition(TimerEvent.START_WORK)
      expect(onEnter).toHaveBeenCalledOnce()
    })

    it('should execute exit side effect on transition', async () => {
      const onExit = vi.fn()
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE, {
        onExitWorkActive: onExit,
      })

      await machine.transition(TimerEvent.COMPLETE)
      expect(onExit).toHaveBeenCalledOnce()
    })

    it('should execute onComplete side effect', async () => {
      const onComplete = vi.fn()
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE, {
        onComplete,
      })

      await machine.transition(TimerEvent.COMPLETE)
      expect(onComplete).toHaveBeenCalledOnce()
    })

    it('should execute onAbandon side effect', async () => {
      const onAbandon = vi.fn()
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE, {
        onAbandon,
      })

      await machine.transition(TimerEvent.ABANDON)
      expect(onAbandon).toHaveBeenCalledOnce()
    })

    it('should execute side effects in correct order', async () => {
      const callOrder: string[] = []
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE, {
        onExitWorkActive: () => callOrder.push('exit'),
        onComplete: () => callOrder.push('complete'),
        onEnterIdle: () => callOrder.push('enter'),
      })

      await machine.transition(TimerEvent.COMPLETE)
      expect(callOrder).toEqual(['exit', 'complete', 'enter'])
    })
  })

  describe('getValidEvents', () => {
    it('should return all valid events for IDLE state', () => {
      const machine = new TimerStateMachine()
      const validEvents = machine.getValidEvents()
      expect(validEvents).toContain(TimerEvent.START_WORK)
      expect(validEvents).toContain(TimerEvent.START_SHORT_BREAK)
      expect(validEvents).toContain(TimerEvent.START_LONG_BREAK)
      expect(validEvents).toHaveLength(3)
    })

    it('should return all valid events for WORK_ACTIVE state', () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      const validEvents = machine.getValidEvents()
      expect(validEvents).toContain(TimerEvent.PAUSE)
      expect(validEvents).toContain(TimerEvent.COMPLETE)
      expect(validEvents).toContain(TimerEvent.SKIP)
      expect(validEvents).toContain(TimerEvent.ABANDON)
      expect(validEvents).toHaveLength(4)
    })
  })

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const machine = new TimerStateMachine(TimerState.WORK_ACTIVE)
      machine.reset()
      expect(machine.getState()).toBe(TimerState.IDLE)
    })
  })

  describe('getStateDescription', () => {
    it('should return correct description for each state', () => {
      const machine = new TimerStateMachine(TimerState.IDLE)
      expect(machine.getStateDescription()).toBe('Ready to start')

      machine.reset()
      const machine2 = new TimerStateMachine(TimerState.WORK_ACTIVE)
      expect(machine2.getStateDescription()).toBe('Work session in progress')
    })
  })

  describe('complete pomodoro cycle', () => {
    it('should successfully complete a full work-pause-resume-complete cycle', async () => {
      const machine = new TimerStateMachine()

      // Start work
      await machine.transition(TimerEvent.START_WORK)
      expect(machine.getState()).toBe(TimerState.WORK_ACTIVE)

      // Pause
      await machine.transition(TimerEvent.PAUSE)
      expect(machine.getState()).toBe(TimerState.WORK_PAUSED)

      // Resume
      await machine.transition(TimerEvent.RESUME)
      expect(machine.getState()).toBe(TimerState.WORK_ACTIVE)

      // Complete
      await machine.transition(TimerEvent.COMPLETE)
      expect(machine.getState()).toBe(TimerState.IDLE)
    })
  })
})
