import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateSettingsUseCase } from '../UpdateSettingsUseCase'
import type { ISettingsRepository } from '@domain/interfaces'
import type { UserSettings } from '@shared/schemas'

const createMockSettingsRepository = (): ISettingsRepository => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
  resetToDefaults: vi.fn(),
  exists: vi.fn(),
  delete: vi.fn(),
})

describe('UpdateSettingsUseCase', () => {
  let useCase: UpdateSettingsUseCase
  let mockSettingsRepo: ISettingsRepository
  let existingSettings: UserSettings

  beforeEach(() => {
    mockSettingsRepo = createMockSettingsRepository()

    existingSettings = {
      userId: 'test-user-id',
      workDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      notificationEnabled: true,
      notificationSound: 'default',
      dailyGoalPomodoros: 8,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }

    vi.mocked(mockSettingsRepo.getSettings).mockResolvedValue(existingSettings)

    useCase = new UpdateSettingsUseCase(mockSettingsRepo)
  })

  it('should update work duration setting', async () => {
    const updatedSettings: UserSettings = {
      ...existingSettings,
      workDuration: 1800, // 30 minutes
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.updateSettings).mockResolvedValue(updatedSettings)

    const result = await useCase.execute({
      userId: 'test-user-id',
      updates: {
        workDuration: 1800,
      },
    })

    expect(result.settings.workDuration).toBe(1800)
    expect(mockSettingsRepo.updateSettings).toHaveBeenCalledWith('test-user-id', {
      workDuration: 1800,
    })
  })

  it('should update multiple settings at once', async () => {
    const updatedSettings: UserSettings = {
      ...existingSettings,
      workDuration: 1800,
      shortBreakDuration: 600,
      notificationEnabled: false,
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.updateSettings).mockResolvedValue(updatedSettings)

    const result = await useCase.execute({
      userId: 'test-user-id',
      updates: {
        workDuration: 1800,
        shortBreakDuration: 600,
        notificationEnabled: false,
      },
    })

    expect(result.settings.workDuration).toBe(1800)
    expect(result.settings.shortBreakDuration).toBe(600)
    expect(result.settings.notificationEnabled).toBe(false)
  })

  it('should update auto-start settings', async () => {
    const updatedSettings: UserSettings = {
      ...existingSettings,
      autoStartBreaks: true,
      autoStartPomodoros: true,
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.updateSettings).mockResolvedValue(updatedSettings)

    const result = await useCase.execute({
      userId: 'test-user-id',
      updates: {
        autoStartBreaks: true,
        autoStartPomodoros: true,
      },
    })

    expect(result.settings.autoStartBreaks).toBe(true)
    expect(result.settings.autoStartPomodoros).toBe(true)
  })

  it('should update daily goal setting', async () => {
    const updatedSettings: UserSettings = {
      ...existingSettings,
      dailyGoalPomodoros: 12,
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.updateSettings).mockResolvedValue(updatedSettings)

    const result = await useCase.execute({
      userId: 'test-user-id',
      updates: {
        dailyGoalPomodoros: 12,
      },
    })

    expect(result.settings.dailyGoalPomodoros).toBe(12)
  })

  it('should get existing settings before updating', async () => {
    const updatedSettings: UserSettings = {
      ...existingSettings,
      workDuration: 1800,
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.updateSettings).mockResolvedValue(updatedSettings)

    await useCase.execute({
      userId: 'test-user-id',
      updates: {
        workDuration: 1800,
      },
    })

    expect(mockSettingsRepo.getSettings).toHaveBeenCalledWith('test-user-id')
  })
})
