import { cn } from '@/shared/lib/cn.ts'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { PERMESSO_TEST_IDS } from '../testIds'

const HOUR_CONFIRMATION = {
	enable: {
		title: 'Turn on daily checks?',
		description: (hour: string) =>
			`Your permesso status will be checked automatically every day at ${hour}:00 (your local time). This repeats daily until you turn it off. You can add more hours or turn off checks anytime.`,
		confirmLabel: 'Turn on',
		variant: 'default',
	},
	disable: {
		title: 'Turn off this check?',
		description: (hour: string) =>
			`Automatic checks at ${hour}:00 will stop. You can turn it back on anytime.`,
		confirmLabel: 'Turn off',
		variant: 'destructive',
	},
} as const

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
	const action = active ? 'disable' : 'enable'
	const confirmation = HOUR_CONFIRMATION[action]
	const onConfirm = active ? onDisable : onEnable
	const buttonClassName = cn(
		'h-8 w-full rounded-md text-xs font-medium border transition-colors disabled:pointer-events-none disabled:opacity-50',
		active
			? 'bg-primary text-primary-foreground border-transparent'
			: 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground',
	)

	return (
		<ConfirmDialog
			trigger={
				<button
					data-testid={PERMESSO_TEST_IDS.hour(hour)}
					type="button"
					disabled={pending}
					aria-pressed={active}
					className={buttonClassName}
				>
					{label}
				</button>
			}
			title={confirmation.title}
			description={confirmation.description(label)}
			confirmLabel={confirmation.confirmLabel}
			variant={confirmation.variant}
			onConfirm={() => onConfirm(hour)}
		/>
	)
}
