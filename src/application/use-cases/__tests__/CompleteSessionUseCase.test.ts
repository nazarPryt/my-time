import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CompleteSessionUseCase } from '../CompleteSessionUseCase'
import type { ISessionRepository } from '@domain/interfaces'
import type { Session } from '@shared/schemas'

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

describe('CompleteSessionUseCase', () => {
  let useCase: CompleteSessionUseCase
  let mockSessionRepo: ISessionRepository

  beforeEach(() => {
    mockSessionRepo = createMockSessionRepository()
    useCase = new CompleteSessionUseCase(mockSessionRepo)
  })

  it('should mark session as completed with actual duration', async () => {
    const existingSession: Session = {
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

    const completedSession: Session = {
      ...existingSession,
      status: 'completed',
      actualDuration: 1490,
      completedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.findById).mockResolvedValue(existingSession)
    vi.mocked(mockSessionRepo.update).mockResolvedValue(completedSession)

    const result = await useCase.execute({
      sessionId: 'session-id',
      completedAt: new Date(),
      actualDuration: 1490,
    })

    expect(result.session.status).toBe('completed')
    expect(result.session.actualDuration).toBe(1490)
    expect(result.session.completedAt).not.toBeNull()
    expect(mockSessionRepo.update).toHaveBeenCalledWith('session-id', {
      status: 'completed',
      completedAt: expect.any(Date),
      actualDuration: 1490,
      updatedAt: expect.any(Date),
    })
  })

  it('should determine session was successful when actual duration is close to planned', async () => {
    const existingSession: Session = {
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

    const completedSession: Session = {
      ...existingSession,
      status: 'completed',
      actualDuration: 1490, // Within 10% variance
      completedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.findById).mockResolvedValue(existingSession)
    vi.mocked(mockSessionRepo.update).mockResolvedValue(completedSession)

    const result = await useCase.execute({
      sessionId: 'session-id',
      completedAt: new Date(),
      actualDuration: 1490,
    })

    expect(result.wasSuccessful).toBe(true)
  })

  it('should determine session was not successful when actual duration is too different', async () => {
    const existingSession: Session = {
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

    const completedSession: Session = {
      ...existingSession,
      status: 'completed',
      actualDuration: 1000, // More than 10% variance
      completedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.findById).mockResolvedValue(existingSession)
    vi.mocked(mockSessionRepo.update).mockResolvedValue(completedSession)

    const result = await useCase.execute({
      sessionId: 'session-id',
      completedAt: new Date(),
      actualDuration: 1000,
    })

    expect(result.wasSuccessful).toBe(false)
  })

  it('should throw error if session not found', async () => {
    vi.mocked(mockSessionRepo.findById).mockResolvedValue(null)

    await expect(
      useCase.execute({
        sessionId: 'non-existent-id',
        completedAt: new Date(),
        actualDuration: 1500,
      }),
    ).rejects.toThrow('Session not found')
  })

  it('should throw error if session is already completed', async () => {
    const alreadyCompletedSession: Session = {
      id: 'session-id',
      userId: 'test-user-id',
      sessionType: 'work',
      status: 'completed',
      plannedDuration: 1500,
      actualDuration: 1500,
      startedAt: new Date(),
      completedAt: new Date(), // Already completed
      pausedDuration: 0,
      tags: [],
      pomodoroCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(mockSessionRepo.findById).mockResolvedValue(alreadyCompletedSession)

    await expect(
      useCase.execute({
        sessionId: 'session-id',
        completedAt: new Date(),
        actualDuration: 1500,
      }),
    ).rejects.toThrow('Session is already completed')
  })
})
