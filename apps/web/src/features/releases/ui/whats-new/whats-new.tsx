import { Dialog } from '@/shared/ui'
import { useWhatsNew } from '../../model/use-whats-new'
import { ReleaseNotesDialog } from './release-notes-dialog'
import { VersionTrigger } from './version-trigger'

// Version label next to the sidebar logo; a dot marks unread release notes.
export function WhatsNew() {
	const { notes, highlighted, hasUnseen, handleOpenChange } = useWhatsNew()

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<VersionTrigger hasUnseen={hasUnseen} />
			<ReleaseNotesDialog notes={notes} highlighted={highlighted} />
		</Dialog>
	)
}
