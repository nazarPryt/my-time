import { z } from 'zod'

/**
 * Chrome Storage Key Enum
 * Centralized storage keys for type safety
 */
export const StorageKeys = {
  CURRENT_SESSION: 'current_session',
  USER_SETTINGS: 'user_settings',
  PENDING_OPERATIONS: 'pending_operations',
  LAST_SYNC: 'last_sync',
  USER_ID: 'user_id',
} as const

/**
 * Storage Version for migration support
 */
const STORAGE_VERSION = 1

/**
 * Chrome Storage Adapter
 * Handles persistence to chrome.storage.local with versioning and quota management
 */
export class ChromeStorageAdapter {
  /**
   * Save data to chrome.storage.local
   */
  async save<T>(key: string, value: T): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value })
    } catch (error) {
      if (error instanceof Error && error.message.includes('QUOTA')) {
        // Handle quota exceeded
        await this.handleQuotaExceeded()
        // Retry save after cleanup
        await chrome.storage.local.set({ [key]: value })
      } else {
        throw error
      }
    }
  }

  /**
   * Load data from chrome.storage.local
   */
  async load<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key)
    return result[key] ?? null
  }

  /**
   * Load data with schema validation
   */
  async loadWithValidation<T>(key: string, schema: z.ZodSchema<T>): Promise<T | null> {
    const data = await this.load(key)

    if (data === null) {
      return null
    }

    const result = schema.safeParse(data)

    if (!result.success) {
      console.error(`Validation failed for key ${key}:`, result.error)
      // Clear corrupted data
      await this.remove(key)
      return null
    }

    return result.data
  }

  /**
   * Remove data from storage
   */
  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key)
  }

  /**
   * Clear all data from storage
   */
  async clear(): Promise<void> {
    await chrome.storage.local.clear()
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{ bytesInUse: number; quotaBytes: number; usagePercentage: number }> {
    const bytesInUse = await chrome.storage.local.getBytesInUse()
    const quotaBytes = chrome.storage.local.QUOTA_BYTES || 10485760 // 10MB default

    return {
      bytesInUse,
      quotaBytes,
      usagePercentage: (bytesInUse / quotaBytes) * 100,
    }
  }

  /**
   * Check if storage is near quota limit
   */
  async isNearQuota(threshold = 80): Promise<boolean> {
    const info = await this.getStorageInfo()
    return info.usagePercentage >= threshold
  }

  /**
   * Handle quota exceeded by cleaning up old data
   */
  private async handleQuotaExceeded(): Promise<void> {
    console.warn('Storage quota exceeded, cleaning up...')

    // Clear pending operations that are older than 7 days
    const pendingOps = await this.load<Array<{ timestamp: number }>>(StorageKeys.PENDING_OPERATIONS)

    if (pendingOps) {
      const now = Date.now()
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

      const filtered = pendingOps.filter(op => op.timestamp > sevenDaysAgo)

      if (filtered.length < pendingOps.length) {
        await this.save(StorageKeys.PENDING_OPERATIONS, filtered)
        console.log(`Cleaned up ${pendingOps.length - filtered.length} old pending operations`)
      }
    }

    // If still over quota, we might need more aggressive cleanup
    const isStillNearQuota = await this.isNearQuota(90)

    if (isStillNearQuota) {
      console.warn('Still near quota after cleanup. Consider syncing pending operations.')
    }
  }

  /**
   * Get storage version for migration support
   */
  async getVersion(): Promise<number> {
    const version = await this.load<number>('storage_version')
    return version ?? 0
  }

  /**
   * Set storage version
   */
  async setVersion(version: number): Promise<void> {
    await this.save('storage_version', version)
  }

  /**
   * Migrate storage if needed
   */
  async migrate(): Promise<void> {
    const currentVersion = await this.getVersion()

    if (currentVersion < STORAGE_VERSION) {
      console.log(`Migrating storage from version ${currentVersion} to ${STORAGE_VERSION}`)

      // Add migration logic here as needed
      // For now, we just update the version

      await this.setVersion(STORAGE_VERSION)
      console.log('Storage migration complete')
    }
  }

  /**
   * Export all data (for backup/debugging)
   */
  async exportAll(): Promise<Record<string, unknown>> {
    return chrome.storage.local.get(null)
  }

  /**
   * Import data (for restore)
   */
  async importAll(data: Record<string, unknown>): Promise<void> {
    await chrome.storage.local.set(data)
  }
}

/**
 * Singleton instance
 */
export const chromeStorage = new ChromeStorageAdapter()
