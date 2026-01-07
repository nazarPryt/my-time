import type { StateCreator } from 'zustand'

export interface PendingOperation {
  id: string
  type: 'session' | 'settings' | 'report'
  operation: 'create' | 'update' | 'delete'
  data: unknown
  timestamp: number
  retryCount: number
}

export interface SyncSlice {
  // State
  isSyncing: boolean
  lastSyncAt: Date | null
  pendingOperations: PendingOperation[]
  syncError: string | null

  // Actions
  setIsSyncing: (isSyncing: boolean) => void
  setLastSyncAt: (date: Date) => void
  queueOperation: (operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => void
  removeOperation: (operationId: string) => void
  incrementRetryCount: (operationId: string) => void
  setSyncError: (error: string | null) => void
  clearPendingOperations: () => void
  clearSyncError: () => void
}

export const createSyncSlice: StateCreator<
  SyncSlice,
  [['zustand/devtools', never], ['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  SyncSlice
> = set => ({
  // Initial state
  isSyncing: false,
  lastSyncAt: null,
  pendingOperations: [],
  syncError: null,

  // Actions
  setIsSyncing: isSyncing =>
    set(
      state => {
        state.isSyncing = isSyncing
      },
      undefined,
      'sync/setIsSyncing',
    ),

  setLastSyncAt: date =>
    set(
      state => {
        state.lastSyncAt = date
      },
      undefined,
      'sync/setLastSyncAt',
    ),

  queueOperation: operation =>
    set(
      state => {
        const pendingOp: PendingOperation = {
          ...operation,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          retryCount: 0,
        }
        state.pendingOperations.push(pendingOp)
      },
      undefined,
      'sync/queueOperation',
    ),

  removeOperation: operationId =>
    set(
      state => {
        state.pendingOperations = state.pendingOperations.filter(op => op.id !== operationId)
      },
      undefined,
      'sync/removeOperation',
    ),

  incrementRetryCount: operationId =>
    set(
      state => {
        const operation = state.pendingOperations.find(op => op.id === operationId)
        if (operation) {
          operation.retryCount += 1
        }
      },
      undefined,
      'sync/incrementRetryCount',
    ),

  setSyncError: error =>
    set(
      state => {
        state.syncError = error
      },
      undefined,
      'sync/setSyncError',
    ),

  clearPendingOperations: () =>
    set(
      state => {
        state.pendingOperations = []
      },
      undefined,
      'sync/clearPendingOperations',
    ),

  clearSyncError: () =>
    set(
      state => {
        state.syncError = null
      },
      undefined,
      'sync/clearSyncError',
    ),
})
