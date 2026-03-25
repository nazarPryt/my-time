import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/shared/lib/cn'
import { useLogout } from '../useLogout'

export function SignOutButton() {
	const { logout } = useLogout()

	return (
		<ConfirmDialog
			trigger={
				<Button
					type="button"
					className={cn(
						'w-full flex items-center gap-2.5 px-3 py-2 rounded-md',
						'text-sm text-sidebar-foreground/55 transition-colors duration-150',
						'hover:text-sidebar-foreground hover:bg-sidebar-accent',
					)}
				>
					<LogOut size={15} strokeWidth={1.75} className="shrink-0" />
					Sign out
				</Button>
			}
			title="Sign out?"
			confirmLabel="Sign out"
			onConfirm={logout}
		/>
	)
}
