import { describe, it, expect } from 'vitest'
import { Duration } from '../Duration'

describe('Duration', () => {
  describe('creation', () => {
    it('should create duration from seconds', () => {
      const duration = Duration.fromSeconds(100)
      expect(duration.toSeconds()).toBe(100)
    })

    it('should create duration from minutes', () => {
      const duration = Duration.fromMinutes(5)
      expect(duration.toSeconds()).toBe(300)
    })

    it('should create duration from hours', () => {
      const duration = Duration.fromHours(2)
      expect(duration.toSeconds()).toBe(7200)
    })

    it('should create zero duration', () => {
      const duration = Duration.zero()
      expect(duration.toSeconds()).toBe(0)
      expect(duration.isZero()).toBe(true)
    })

    it('should throw error for negative duration', () => {
      expect(() => Duration.fromSeconds(-10)).toThrow('Duration cannot be negative')
    })

    it('should round fractional seconds to integer', () => {
      const duration = Duration.fromSeconds(10.7)
      expect(duration.toSeconds()).toBe(11)
    })
  })

  describe('conversions', () => {
    it('should convert to minutes', () => {
      const duration = Duration.fromSeconds(300)
      expect(duration.toMinutes()).toBe(5)
    })

    it('should convert to hours', () => {
      const duration = Duration.fromSeconds(7200)
      expect(duration.toHours()).toBe(2)
    })

    it('should format as time string (MM:SS)', () => {
      const duration = Duration.fromSeconds(305)
      expect(duration.toTimeString()).toBe('05:05')
    })

    it('should format as time string (HH:MM:SS)', () => {
      const duration = Duration.fromSeconds(3665)
      expect(duration.toTimeString()).toBe('01:01:05')
    })

    it('should format as human readable (minutes)', () => {
      const duration = Duration.fromMinutes(25)
      expect(duration.toHumanReadable()).toBe('25m')
    })

    it('should format as human readable (hours and minutes)', () => {
      const duration = Duration.fromSeconds(5400) // 1h 30m
      expect(duration.toHumanReadable()).toBe('1h 30m')
    })

    it('should format as human readable (seconds only)', () => {
      const duration = Duration.fromSeconds(45)
      expect(duration.toHumanReadable()).toBe('45s')
    })
  })

  describe('operations', () => {
    it('should add durations', () => {
      const d1 = Duration.fromMinutes(25)
      const d2 = Duration.fromMinutes(5)
      const result = d1.add(d2)
      expect(result.toMinutes()).toBe(30)
    })

    it('should subtract durations', () => {
      const d1 = Duration.fromMinutes(25)
      const d2 = Duration.fromMinutes(5)
      const result = d1.subtract(d2)
      expect(result.toMinutes()).toBe(20)
    })

    it('should throw when subtracting larger duration from smaller', () => {
      const d1 = Duration.fromMinutes(5)
      const d2 = Duration.fromMinutes(25)
      expect(() => d1.subtract(d2)).toThrow('Cannot subtract a larger duration from a smaller one')
    })

    it('should multiply duration', () => {
      const duration = Duration.fromMinutes(5)
      const result = duration.multiply(4)
      expect(result.toMinutes()).toBe(20)
    })

    it('should throw when multiplying by negative', () => {
      const duration = Duration.fromMinutes(5)
      expect(() => duration.multiply(-2)).toThrow('Cannot multiply duration by a negative number')
    })
  })

  describe('comparisons', () => {
    it('should check if greater than', () => {
      const d1 = Duration.fromMinutes(25)
      const d2 = Duration.fromMinutes(5)
      expect(d1.isGreaterThan(d2)).toBe(true)
      expect(d2.isGreaterThan(d1)).toBe(false)
    })

    it('should check if less than', () => {
      const d1 = Duration.fromMinutes(5)
      const d2 = Duration.fromMinutes(25)
      expect(d1.isLessThan(d2)).toBe(true)
      expect(d2.isLessThan(d1)).toBe(false)
    })

    it('should check equality', () => {
      const d1 = Duration.fromMinutes(25)
      const d2 = Duration.fromMinutes(25)
      const d3 = Duration.fromMinutes(5)
      expect(d1.equals(d2)).toBe(true)
      expect(d1.equals(d3)).toBe(false)
    })
  })

  describe('standard durations', () => {
    it('should create standard work duration (25 min)', () => {
      const duration = Duration.standardWork()
      expect(duration.toMinutes()).toBe(25)
    })

    it('should create standard short break (5 min)', () => {
      const duration = Duration.standardShortBreak()
      expect(duration.toMinutes()).toBe(5)
    })

    it('should create standard long break (15 min)', () => {
      const duration = Duration.standardLongBreak()
      expect(duration.toMinutes()).toBe(15)
    })
  })
})
