import type { OfflineJournal } from 'contracts'

export { type OfflineJournal, OfflineJournalSchema } from 'contracts'

export interface OfflineStore {
	load(): OfflineJournal
	/** Must durably commit before returning, or throw without accepting work. */
	save(journal: OfflineJournal): void
}

export function emptyOfflineJournal(): OfflineJournal {
	return { version: 1, sessions: [], confirmed: null }
}
