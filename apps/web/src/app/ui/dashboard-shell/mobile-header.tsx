import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Logo } from '@/shared/ui/logo'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'
import { SidebarContent } from './sidebar-content'

export function MobileHeader() {
	const [isNavOpen, setIsNavOpen] = useState(false)

	return (
		<header className="flex md:hidden items-center gap-2 h-14 px-3 border-b border-sidebar-border bg-sidebar shrink-0">
			<Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-11"
						aria-label="Open menu"
					>
						<Menu className="size-6" strokeWidth={1.75} />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="w-80 max-w-[85vw] p-0"
					title="Navigation"
				>
					<SidebarContent onNavigate={() => setIsNavOpen(false)} />
				</SheetContent>
			</Sheet>
			<Logo className="text-[17px] text-sidebar-foreground" />
		</header>
	)
}
