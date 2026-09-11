import { useEffect } from 'react'
import { usePermessoActions, usePermessoState } from '../store'
import { DangerZone } from './danger-zone'
import { HistorySection } from './history-section'
import { PracticeNumberSection } from './practice-number-section'
import { ScheduleSection } from './schedule-section'
import { StatusCard } from './status-card'
import { TelegramCard } from './telegram-card'

export function PermessoStatusWidget() {
	const {
		status,
		history,
		loading,
		submitting,
		checking,
		updatingSchedule,
		pendingCheckHour,
		connectingTelegram,
		disconnectingTelegram,
		resettingAll,
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
		resetAll,
	} = usePermessoActions()

	useEffect(() => {
		void load()
	}, [load])

	return (
		<div className="h-full flex flex-col">
			<header className="h-14 flex items-center px-4 sm:px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground tracking-tight">
					Permesso Status
				</h1>
			</header>

			<div className="flex-1 overflow-auto p-4 sm:p-8">
				<div className="max-w-lg mx-auto space-y-6">
					{loading || !status ? (
						<div className="rounded-xl border border-border bg-card p-7 flex items-center justify-center h-32">
							<span className="text-xs text-muted-foreground">Loading…</span>
						</div>
					) : (
						<>
							{status.practiceNumber && (
								<StatusCard
									status={status}
									checking={checking}
									onCheck={check}
								/>
							)}

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

							<PracticeNumberSection
								defaultValue={status.practiceNumber ?? ''}
								submitting={submitting}
								onSave={savePracticeNumber}
							/>

							{status.practiceNumber && (
								<ScheduleSection
									checkHours={status.checkHours}
									disabled={updatingSchedule}
									pendingHour={pendingCheckHour}
									onChange={updateCheckHours}
								/>
							)}

							{status.practiceNumber && (
								<DangerZone resetting={resettingAll} onReset={resetAll} />
							)}

							{status.practiceNumber && (
								<HistorySection history={history} loading={loading} />
							)}
						</>
					)}

					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>
			</div>
		</div>
	)
}
