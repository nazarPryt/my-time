import type { ReleaseNote } from '@my-time/contracts'
import { format, parseISO } from 'date-fns'
import { Badge } from '@/shared/ui'
import { RELEASES_TEST_IDS as T } from '../../test-ids'
import { NoteList } from './note-list'

export function ReleaseEntry({
	note,
	isNew,
}: {
	note: ReleaseNote
	isNew: boolean
}) {
	return (
		<section
			data-testid={T.note(note.version)}
			className="space-y-2 py-5 first:pt-0 last:pb-0"
		>
			<div className="flex items-baseline gap-2">
				<h3 className="text-base font-semibold">v{note.version}</h3>
				<span className="text-muted-foreground text-xs">
					{format(parseISO(note.date), 'MMM d, yyyy')}
				</span>
				{isNew && <Badge data-testid={T.newBadge}>New</Badge>}
			</div>
			<NoteList title="New" items={note.features} />
			<NoteList title="Fixed" items={note.fixes} />
		</section>
	)
}
