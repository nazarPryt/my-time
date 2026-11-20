import { RELEASE_NOTES, type ReleaseNote } from 'contracts'
import { format, parseISO } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { APP_VERSION } from '@/shared/config/app-version'
import { cn } from '@/shared/lib/cn'
import {
	Badge,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/ui'
import { releasedNotes, unseenVersions } from '../lib/unseen-releases'
import { useReleasesStore } from '../model/store'
import { RELEASES_TEST_IDS as T } from '../test-ids'

// Version label in the sidebar footer; a dot marks unread release notes.
export function WhatsNew() {
	const lastSeenVersion = useReleasesStore((s) => s.lastSeenVersion)
	const load = useReleasesStore((s) => s.load)
	const markSeen = useReleasesStore((s) => s.markSeen)
	const notes = useMemo(() => releasedNotes(RELEASE_NOTES, APP_VERSION), [])
	// Captured on open, so "New" badges don't vanish while the dialog is showing.
	const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

	useEffect(() => {
		void load()
	}, [load])

	const unseen =
		lastSeenVersion === undefined
			? new Set<string>()
			: unseenVersions(RELEASE_NOTES, APP_VERSION, lastSeenVersion)
	const hasUnseen = unseen.size > 0

	function handleOpenChange(open: boolean) {
		if (!open) return
		setHighlighted(unseen)
		if (hasUnseen) void markSeen(APP_VERSION)
	}

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<button
					type="button"
					data-testid={T.versionTrigger}
					title={hasUnseen ? "See what's new" : 'Release notes'}
					className={cn(
						'flex w-full items-center gap-2 rounded-md px-3 py-1 text-left',
						'text-[10px] font-medium tracking-widest uppercase transition-colors',
						hasUnseen
							? 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
							: 'text-sidebar-foreground/25 hover:text-sidebar-foreground/55',
					)}
				>
					v{APP_VERSION}
					{hasUnseen && (
						<span
							data-testid={T.unseenDot}
							className="ml-auto flex items-center gap-1.5 normal-case tracking-normal text-sidebar-primary"
						>
							What's new
							<span
								aria-hidden="true"
								className="size-2 rounded-full bg-sidebar-primary"
							/>
						</span>
					)}
				</button>
			</DialogTrigger>
			<DialogContent
				data-testid={T.dialog}
				closeTestId={T.dialogClose}
				className="max-h-[85vh] grid-rows-[auto_1fr]"
			>
				<DialogHeader>
					<DialogTitle>What's new</DialogTitle>
					<DialogDescription>
						You're on my·time v{APP_VERSION}.
					</DialogDescription>
				</DialogHeader>
				<div className="-mr-2 space-y-5 overflow-y-auto pr-2">
					{notes.map((note) => (
						<ReleaseEntry
							key={note.version}
							note={note}
							isNew={highlighted.has(note.version)}
						/>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}

function ReleaseEntry({ note, isNew }: { note: ReleaseNote; isNew: boolean }) {
	return (
		<section data-testid={T.note(note.version)} className="space-y-2">
			<div className="flex items-baseline gap-2">
				<h3 className="text-sm font-semibold">v{note.version}</h3>
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

function NoteList({ title, items }: { title: string; items: string[] }) {
	if (items.length === 0) return null
	return (
		<div>
			<p className="text-muted-foreground mb-1 text-xs font-medium">{title}</p>
			<ul className="list-disc space-y-1 pl-5 text-sm">
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	)
}
