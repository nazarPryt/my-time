import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'

// Shared by the desktop sidebar and the mobile sheet.
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<>
			<SidebarHeader />
			<SidebarNav onNavigate={onNavigate} />
			<SidebarFooter />
		</>
	)
}
