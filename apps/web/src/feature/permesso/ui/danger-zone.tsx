import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

type Props = {
	resetting: boolean
	onReset: () => void
}

export function DangerZone({ resetting, onReset }: Props) {
	const [confirmingFirst, setConfirmingFirst] = useState(false)
	const [confirmingSecond, setConfirmingSecond] = useState(false)

	return (
		<>
			<Card className="border-destructive/30">
				<CardHeader>
					<CardTitle className="text-destructive">Danger zone</CardTitle>
					<CardDescription>
						Already got your permesso di soggiorno? Permanently delete your
						practice number, automatic check schedule, Telegram connection, and
						check history.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ConfirmDialog
						trigger={
							<Button
								variant="destructive"
								size="sm"
								disabled={resetting}
								isLoading={resetting}
							>
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
