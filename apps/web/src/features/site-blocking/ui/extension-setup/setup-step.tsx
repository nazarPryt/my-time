import { CheckIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

interface SetupStepProps {
	number: number
	title: string
	done: boolean
	/** Greys the step out until the one before it is done. */
	disabled?: boolean
	testId: string
	children?: ReactNode
}

/** One numbered step of the setup guide; the number turns into a check when done. */
export function SetupStep({
	number,
	title,
	done,
	disabled = false,
	testId,
	children,
}: SetupStepProps) {
	return (
		<li
			className={cn('flex gap-3', disabled && 'opacity-50')}
			data-testid={testId}
			data-disabled={disabled || undefined}
		>
			<span
				className={cn(
					'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
					done
						? 'border-green-500 bg-green-500/10 text-green-500'
						: 'border-border text-muted-foreground',
				)}
			>
				{done ? <CheckIcon className="size-3.5" /> : number}
			</span>
			<div className="flex-1 space-y-2">
				<p className="font-medium text-foreground">
					{title}
					{done && (
						<span
							className="ml-2 text-xs font-normal text-green-500"
							data-testid={SB.stepDone}
						>
							Done
						</span>
					)}
				</p>
				{children}
			</div>
		</li>
	)
}
