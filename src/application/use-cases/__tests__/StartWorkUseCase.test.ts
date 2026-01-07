import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StartWorkUseCase } from '../StartWorkUseCase'
import type { ISessionRepository, ISettingsRepository } from '@domain/interfaces'
import type { Session, UserSettings } from '@shared/schemas'

// Mock repositories
const createMockSessionRepository = (): ISessionRepository => ({
  save: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findByUserAndDate: vi.fn(),
  findByUserAndDateRange: vi.fn(),
  delete: vi.fn(),
  countByUserAndType: vi.fn(),
  countByUserAndStatus: vi.fn(),
  findMostRecent: vi.fn(),
  findByTags: vi.fn(),
})

const createMockSettingsRepository = (): ISettingsRepository => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
  resetToDefaults: vi.fn(),
  exists: vi.fn(),
  delete: vi.fn(),
})

describe('StartWorkUseCase', () => {
  let useCase: StartWorkUseCase
  let mockSessionRepo: ISessionRepository
  let mockSettingsRepo: ISettingsRepository
  let mockSettings: UserSettings

  beforeEach(() => {
    mockSessionRepo = createMockSessionRepository()
    mockSettingsRepo = createMockSettingsRepository()

    // Default settings
    mockSettings = {
      userId: 'test-user-id',
      workDuration: 1500, // 25 minutes
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      notificationEnabled: true,
      notificationSound: 'default',
      dailyGoalPomodoros: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSettingsRepo.getSettings).mockResolvedValue(mockSettings)
    vi.mocked(mockSessionRepo.findByUserAndDateRange).mockResolvedValue([])

    useCase = new StartWorkUseCase(mockSessionRepo, mockSettingsRepo)
  })

  it('should create a new work session with correct duration from settings', async () => {
    const savedSession: Session = {
      id: 'session-id',
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: [],
      pomodoroCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.save).mockResolvedValue(savedSession)

    const result = await useCase.execute({
      userId: 'test-user-id',
    })

    expect(result.session).toEqual(savedSession)
    expect(result.pomodoroCount).toBe(1)
    expect(mockSettingsRepo.getSettings).toHaveBeenCalledWith('test-user-id')
    expect(mockSessionRepo.save).toHaveBeenCalled()
  })

  it('should calculate correct pomodoro count based on completed sessions', async () => {
    // Mock 2 completed work sessions today
    const completedSessions: Session[] = [
      {
        id: 'session-1',
        userId: 'test-user-id',
        sessionType: 'work',
        status: 'completed',
        plannedDuration: 1500,
        actualDuration: 1500,
        startedAt: new Date(),
        completedAt: new Date(),
        pausedDuration: 0,
        tags: [],
        pomodoroCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'session-2',
        userId: 'test-user-id',
        sessionType: 'work',
        status: 'completed',
        plannedDuration: 1500,
        actualDuration: 1500,
        startedAt: new Date(),
        completedAt: new Date(),
        pausedDuration: 0,
        tags: [],
        pomodoroCount: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(mockSessionRepo.findByUserAndDateRange).mockResolvedValue(completedSessions)

    const savedSession: Session = {
      id: 'session-3',
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: [],
      pomodoroCount: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.save).mockResolvedValue(savedSession)

    const result = await useCase.execute({
      userId: 'test-user-id',
    })

    // With 2 completed and longBreakInterval=4, next should be 3
    expect(result.pomodoroCount).toBe(3)
  })

  it('should include tags and notes when provided', async () => {
    const savedSession: Session = {
      id: 'session-id',
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: ['deep-work', 'coding'],
      notes: 'Working on feature X',
      pomodoroCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.save).mockResolvedValue(savedSession)

    const result = await useCase.execute({
      userId: 'test-user-id',
      tags: ['deep-work', 'coding'],
      notes: 'Working on feature X',
    })

    expect(result.session.tags).toEqual(['deep-work', 'coding'])
    expect(result.session.notes).toBe('Working on feature X')
  })

  it('should cycle pomodoro count based on longBreakInterval', async () => {
    // Mock 4 completed sessions (should cycle back to 1)
    const completedSessions: Session[] = Array.from({ length: 4 }, (_, i) => ({
      id: `session-${i}`,
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 1500,
      startedAt: new Date(),
      completedAt: new Date(),
      pausedDuration: 0,
      tags: [],
      pomodoroCount: i + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as Session[]

    vi.mocked(mockSessionRepo.findByUserAndDateRange).mockResolvedValue(completedSessions)

    const savedSession: Session = {
      id: 'session-5',
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 0,
      startedAt: new Date(),
      completedAt: null,
      pausedDuration: 0,
      tags: [],
      pomodoroCount: 1, // Should cycle back to 1
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.save).mockResolvedValue(savedSession)

    const result = await useCase.execute({
      userId: 'test-user-id',
    })

    // After 4 completed (with longBreakInterval=4), should cycle to 1
    expect(result.pomodoroCount).toBe(1)
  })
})
