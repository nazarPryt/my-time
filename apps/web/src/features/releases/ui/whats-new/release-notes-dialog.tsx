import type { ReleaseNote } from '@my-time/contracts'
import { APP_VERSION } from '@/shared/config/app-version'
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/shared/ui'
import { RELEASES_TEST_IDS as T } from '../../test-ids'
import { ReleaseEntry } from './release-entry'

type ReleaseNotesDialogProps = {
	notes: ReleaseNote[]
	highlighted: Set<string>
}

export function ReleaseNotesDialog({
	notes,
	highlighted,
}: ReleaseNotesDialogProps) {
	return (
		<DialogContent
			data-testid={T.dialog}
			closeTestId={T.dialogClose}
			className="max-h-[85vh] grid-rows-[auto_1fr]"
		>
			<DialogHeader>
				<DialogTitle>What's new</DialogTitle>
				<DialogDescription>You're on my·time v{APP_VERSION}.</DialogDescription>
			</DialogHeader>
			<div className="-mr-2 divide-y divide-border overflow-y-auto pr-2">
				{notes.map((note) => (
					<ReleaseEntry
						key={note.version}
						note={note}
						isNew={highlighted.has(note.version)}
					/>
				))}
			</div>
		</DialogContent>
	)
}
