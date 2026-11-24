import type { ReactNode } from 'react'
import { MobileHeader } from './mobile-header'
import { SidebarContent } from './sidebar-content'

export function DashboardShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
			<MobileHeader />
			<aside className="hidden md:flex w-55 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
				<SidebarContent />
			</aside>
			<main className="flex-1 overflow-auto min-w-0">{children}</main>
		</div>
	)
}
