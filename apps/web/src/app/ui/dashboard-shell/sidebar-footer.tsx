import { SignOutButton } from '@/features/auth/logout'

export function SidebarFooter() {
	return (
		<div className="shrink-0 p-3 border-t border-sidebar-border">
			<SignOutButton />
		</div>
	)
}
