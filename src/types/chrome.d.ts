// Chrome extension types placeholder
// This provides basic types for Chrome APIs we use
// For full types, install @types/chrome

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string[] | Record<string, any> | null, callback: (items: Record<string, any>) => void): void
      set(items: Record<string, any>, callback?: () => void): void
      remove(keys: string | string[], callback?: () => void): void
      clear(callback?: () => void): void
      getBytesInUse(keys?: string | string[] | null, callback?: (bytesInUse: number) => void): void
    }

    const local: StorageArea
    const sync: StorageArea
  }
}
