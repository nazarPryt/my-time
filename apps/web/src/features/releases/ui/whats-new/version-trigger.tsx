import { APP_VERSION } from '@/shared/config/app-version'
import { cn } from '@/shared/lib/cn'
import { DialogTrigger } from '@/shared/ui'
import { RELEASES_TEST_IDS as T } from '../../test-ids'

export function VersionTrigger({ hasUnseen }: { hasUnseen: boolean }) {
	const label = hasUnseen ? "See what's new" : 'Release notes'

	return (
		<DialogTrigger asChild>
			<button
				type="button"
				data-testid={T.versionTrigger}
				title={label}
				aria-label={`v${APP_VERSION}, ${label}`}
				className={cn(
					'flex items-center gap-1.5 rounded-full px-2 py-0.5',
					'text-[11px] font-medium tabular-nums transition-colors',
					hasUnseen
						? 'bg-sidebar-primary/15 text-sidebar-primary hover:bg-sidebar-primary/25'
						: 'text-sidebar-foreground/35 hover:bg-sidebar-accent hover:text-sidebar-foreground/70',
				)}
			>
				v{APP_VERSION}
				{hasUnseen && (
					<span
						data-testid={T.unseenDot}
						aria-hidden="true"
						className="size-1.5 rounded-full bg-sidebar-primary"
					/>
				)}
			</button>
		</DialogTrigger>
	)
}
