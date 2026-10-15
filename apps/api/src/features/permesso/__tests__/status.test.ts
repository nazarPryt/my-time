import { expect, test } from 'bun:test'
import { isPermessoReady, normalizePermessoStatus } from '../lib/status'

test('normalizes accents, case, and whitespace', () => {
	expect(normalizePermessoStatus('  È PRONTO\n per\tla consegna. ')).toBe(
		'e pronto per la consegna.',
	)
})

test('recognizes readiness within the full portal message', () => {
	expect(
		isPermessoReady('Il documento di soggiorno È PRONTO\nPER LA CONSEGNA.'),
	).toBe(true)
})

test('recognizes the actual ready message transcribed from fixtures/ready.jpg', () => {
	const status = `Il documento di soggiorno è pronto per la consegna.
		In consegna, con sms le verrà indicato quando e dove ritirare il permesso di soggiorno
		Lo può ritirare presso:
		UFFICIO IMMIGRAZIONE PRESSO UFFICIO STRANIERI POLIZIA - CASERTA`
	expect(isPermessoReady(status)).toBe(true)
})

test.each([
	'documento di soggiorno in trattazione.',
	'Il documento di soggiorno non è presente in archivio.',
	'Il documento non è pronto per la consegna.',
	'Stato sconosciuto',
	'',
])('does not label other statuses ready: %s', (status) => {
	expect(isPermessoReady(status)).toBe(false)
})
