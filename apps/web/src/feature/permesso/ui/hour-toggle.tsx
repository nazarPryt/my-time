import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/shared/lib/cn.ts'

type Props = {
	hour: number
	active: boolean
	pending: boolean
	onEnable: (hour: number) => void
	onDisable: (hour: number) => void
}

export function HourToggle({
	hour,
	active,
	pending,
	onEnable,
	onDisable,
}: Props) {
	const label = String(hour).padStart(2, '0')
	const buttonClassName = cn(
		'h-8 w-full rounded-md text-xs font-medium border transition-colors disabled:pointer-events-none disabled:opacity-50',
		active
			? 'bg-primary text-primary-foreground border-transparent'
			: 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground',
	)

	if (!active) {
		return (
			<button
				type="button"
				disabled={pending}
				onClick={() => onEnable(hour)}
				aria-pressed={active}
				className={buttonClassName}
			>
				{label}
			</button>
		)
	}

	return (
		<ConfirmDialog
			trigger={
				<button
					type="button"
					disabled={pending}
					aria-pressed={active}
					className={buttonClassName}
				>
					{label}
				</button>
			}
			title="Turn off this check?"
			description={`Automatic checks at ${label}:00 will stop. You can turn it back on anytime.`}
			confirmLabel="Turn off"
			variant="destructive"
			onConfirm={() => onDisable(hour)}
		/>
	)
}
