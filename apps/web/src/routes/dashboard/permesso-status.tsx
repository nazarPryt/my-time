import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	CheckHistory,
	PracticeNumberForm,
	ScheduleEditor,
	StatusCard,
	TelegramCard,
	usePermessoActions,
	usePermessoState,
} from '@/feature/permesso'

export const Route = createFileRoute('/dashboard/permesso-status')({
	component: PermessoStatusPage,
})

function PermessoStatusPage() {
	const {
		status,
		history,
		loading,
		submitting,
		checking,
		updatingSchedule,
		connectingTelegram,
		disconnectingTelegram,
		error,
		telegramError,
	} = usePermessoState()
	const {
		load,
		savePracticeNumber,
		updateCheckHours,
		check,
		connectTelegram,
		disconnectTelegram,
	} = usePermessoActions()

	useEffect(() => {
		void load()
	}, [load])

	return (
		<div className="h-full flex flex-col">
			<header className="h-14 flex items-center px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground tracking-tight">
					Permesso Status
				</h1>
			</header>

			<div className="flex-1 overflow-auto p-8">
				<div className="max-w-lg mx-auto space-y-6">
					{loading || !status ? (
						<div className="rounded-xl border border-border bg-card p-7 flex items-center justify-center h-32">
							<span className="text-xs text-muted-foreground">Loading…</span>
						</div>
					) : (
						<>
							<StatusCard status={status} checking={checking} onCheck={check} />

							{status.practiceNumber && (
								<TelegramCard
									status={status}
									connecting={connectingTelegram}
									disconnecting={disconnectingTelegram}
									error={telegramError}
									onConnect={connectTelegram}
									onDisconnect={disconnectTelegram}
								/>
							)}

							<Card>
								<CardHeader>
									<CardTitle>Practice number</CardTitle>
									<CardDescription>
										The number used to check your permesso di soggiorno status.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<PracticeNumberForm
										defaultValue={status.practiceNumber ?? ''}
										submitting={submitting}
										onSave={savePracticeNumber}
									/>
								</CardContent>
							</Card>

							{status.practiceNumber && (
								<Card>
									<CardHeader>
										<CardTitle>Automatic checks</CardTitle>
										<CardDescription>
											Pick which hours of the day to check automatically.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ScheduleEditor
											checkHours={status.checkHours}
											disabled={updatingSchedule}
											onChange={updateCheckHours}
										/>
									</CardContent>
								</Card>
							)}
						</>
					)}

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="rounded-xl border border-border bg-card overflow-hidden">
						<div className="px-4 py-3 border-b border-border">
							<h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								History
							</h2>
						</div>
						<CheckHistory history={history} loading={loading} />
					</div>
				</div>
			</div>
		</div>
	)
}
