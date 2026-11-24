import { NAV_ITEMS } from './nav-items'
import { SidebarNavLink } from './sidebar-nav-link'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<nav className="flex-1 p-3 pt-4 space-y-1 md:p-2 md:pt-3 md:space-y-0.5 overflow-y-auto">
			{NAV_ITEMS.map((item) => (
				<SidebarNavLink key={item.to} item={item} onNavigate={onNavigate} />
			))}
		</nav>
	)
}
