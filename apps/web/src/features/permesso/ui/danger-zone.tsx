import { ShieldAlert, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { PERMESSO_TEST_IDS } from '../testIds'

type Props = {
	resetting: boolean
	onReset: () => void
}

export function DangerZone({ resetting, onReset }: Props) {
	const [confirmingFirst, setConfirmingFirst] = useState(false)
	const [confirmingSecond, setConfirmingSecond] = useState(false)

	return (
		<>
			<Card className="ring-destructive/25">
				<CardHeader className="gap-3">
					<CardTitle className="flex items-center gap-2 text-destructive">
						<ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
						Danger zone
					</CardTitle>
					<CardDescription className="leading-relaxed">
						Finished tracking your permesso? You can remove your saved data and
						stop automatic checks here.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border border-destructive/15 bg-destructive/5 p-3 text-sm leading-relaxed">
						<p className="font-medium text-foreground">
							This cannot be undone.
						</p>
						<p className="mt-1 text-muted-foreground">
							Deletes your practice number, schedule, and check history, and
							disconnects Telegram.
						</p>
					</div>
					<ConfirmDialog
						trigger={
							<Button
								data-testid={PERMESSO_TEST_IDS.reset}
								variant="destructive"
								size="sm"
								className="w-full min-h-11 whitespace-normal h-auto py-2.5 sm:w-auto sm:min-h-0"
								disabled={resetting}
								isLoading={resetting}
							>
								<Trash2 className="size-4" aria-hidden="true" />
								Delete all permesso data
							</Button>
						}
						open={confirmingFirst}
						onOpenChange={setConfirmingFirst}
						title="Delete all permesso data?"
						description="This permanently deletes your practice number, automatic check schedule, entire check history, and disconnects Telegram notifications. Automatic checks stop immediately, and this cannot be undone. Only do this if you no longer need to track your permesso di soggiorno."
						confirmLabel="Continue"
						variant="destructive"
						onConfirm={() => setConfirmingSecond(true)}
					/>
				</CardContent>
			</Card>

			<ConfirmDialog
				testId={PERMESSO_TEST_IDS.resetFinalDialog}
				open={confirmingSecond}
				onOpenChange={setConfirmingSecond}
				title="Are you absolutely sure?"
				description="There is no way to recover this data once it's deleted. If you ever need to check your permesso again, you'll have to set everything up from scratch — practice number, schedule, and Telegram connection."
				confirmLabel="Delete everything"
				variant="destructive"
				onConfirm={onReset}
			/>
		</>
	)
}
