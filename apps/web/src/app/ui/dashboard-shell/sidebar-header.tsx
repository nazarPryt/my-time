import { WhatsNew } from '@/features/releases'
import { Logo } from '@/shared/ui/logo'

export function SidebarHeader() {
	return (
		<div className="flex h-14 items-center px-5 border-b border-sidebar-border shrink-0">
			<div className="flex flex-1 items-center justify-between gap-2">
				<Logo className="text-[17px] text-sidebar-foreground" />
				<WhatsNew />
			</div>
		</div>
	)
}
