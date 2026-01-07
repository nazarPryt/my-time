import { z } from 'zod'

/**
 * User Settings Schema
 * Defines all configurable preferences for the Pomodoro timer
 */
export const UserSettingsSchema = z.object({
  userId: z.string().uuid(),
  // Duration settings (in seconds)
  workDuration: z
    .number()
    .int()
    .min(60, { message: 'Work duration must be at least 1 minute' })
    .max(7200, { message: 'Work duration must not exceed 2 hours' })
    .default(1500), // 25 minutes
  shortBreakDuration: z
    .number()
    .int()
    .min(60, { message: 'Short break duration must be at least 1 minute' })
    .max(1800, { message: 'Short break duration must not exceed 30 minutes' })
    .default(300), // 5 minutes
  longBreakDuration: z
    .number()
    .int()
    .min(300, { message: 'Long break duration must be at least 5 minutes' })
    .max(3600, { message: 'Long break duration must not exceed 1 hour' })
    .default(900), // 15 minutes
  // Pomodoro cycle settings
  longBreakInterval: z
    .number()
    .int()
    .min(2, { message: 'Long break interval must be at least 2' })
    .max(10, { message: 'Long break interval must not exceed 10' })
    .default(4),
  // Auto-start settings
  autoStartBreaks: z.boolean().default(false),
  autoStartPomodoros: z.boolean().default(false),
  // Notification settings
  notificationEnabled: z.boolean().default(true),
  notificationSound: z.string().default('default'),
  // Goal settings
  dailyGoalPomodoros: z
    .number()
    .int()
    .min(1, { message: 'Daily goal must be at least 1 pomodoro' })
    .max(24, { message: 'Daily goal must not exceed 24 pomodoros' })
    .default(8),
  // Metadata
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

/**
 * Partial settings schema for updates
 */
export const PartialUserSettingsSchema = UserSettingsSchema.partial().omit({
  userId: true,
  createdAt: true,
})
export type PartialUserSettings = z.infer<typeof PartialUserSettingsSchema>

/**
 * Default settings factory function
 */
export const createDefaultSettings = (userId: string): UserSettings => {
  return UserSettingsSchema.parse({ userId })
}
