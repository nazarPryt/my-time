import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/shared/lib/cn'
import { useTimeTrackerStore } from '../store'
import { formatElapsed } from '../utils'
import { SessionList } from './SessionList'
import { TodayStats } from './TodayStats'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimeTrackerWidget() {
	const activeSession = useTimeTrackerStore((s) => s.activeSession)
	const loading = useTimeTrackerStore((s) => s.loading)
	const submitting = useTimeTrackerStore((s) => s.submitting)
	const elapsed = useTimeTrackerStore((s) => s.elapsed)
	const load = useTimeTrackerStore((s) => s.load)
	const startWork = useTimeTrackerStore((s) => s.startWork)
	const stopWork = useTimeTrackerStore((s) => s.stopWork)
	const abandonSession = useTimeTrackerStore((s) => s.abandonSession)

	useEffect(() => {
		const controller = new AbortController()
		void load(controller.signal)
		return () => controller.abort()
	}, [load])

	// Ring pulses once per minute while working
	const progress = activeSession ? (elapsed % 60) / 60 : 0
	const strokeOffset = CIRCUMFERENCE * (1 - progress)

	return (
		<div className="h-full flex flex-col">
			<div className="h-14 flex items-center px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-medium text-foreground">Time Tracker</h1>
			</div>

			<div className="flex-1 overflow-auto p-8">
				<div className="max-w-105 mx-auto space-y-4">
					{loading ? (
						<div className="rounded-xl border border-border bg-card p-7 flex items-center justify-center h-64">
							<span className="text-xs text-muted-foreground">Loading…</span>
						</div>
					) : (
						<>
							<div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-6">
								<Badge
									variant={activeSession ? 'default' : 'outline'}
									className={cn(
										'text-xs font-medium',
										!activeSession && 'text-muted-foreground',
									)}
								>
									{activeSession ? 'Working' : 'Ready'}
								</Badge>

								<div className="relative">
									<svg
										width="200"
										height="200"
										className="-rotate-90"
										aria-label="Work timer"
										role="img"
									>
										<title>Work timer</title>
										<circle
											cx="100"
											cy="100"
											r={RADIUS}
											fill="none"
											stroke="currentColor"
											strokeWidth="6"
											className="text-border"
										/>
										<circle
											cx="100"
											cy="100"
											r={RADIUS}
											fill="none"
											stroke="currentColor"
											strokeWidth="6"
											strokeLinecap="round"
											strokeDasharray={CIRCUMFERENCE}
											strokeDashoffset={strokeOffset}
											className={cn(
												'transition-[stroke-dashoffset] duration-1000 ease-linear',
												activeSession
													? 'text-primary'
													: 'text-muted-foreground/25',
											)}
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
										<span className="text-3xl font-mono font-semibold tracking-tight text-foreground tabular-nums">
											{formatElapsed(elapsed)}
										</span>
										{activeSession && (
											<span className="text-[11px] text-muted-foreground">
												elapsed
											</span>
										)}
									</div>
								</div>

								{activeSession ? (
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="lg"
											onClick={stopWork}
											isLoading={submitting}
											className="w-36"
										>
											Stop Work
										</Button>
										<ConfirmDialog
											trigger={
												<Button
													variant="ghost"
													size="icon"
													className="text-muted-foreground hover:text-destructive"
													disabled={submitting}
												>
													<Trash2 className="size-4" />
												</Button>
											}
											title="Delete session?"
											description="This session will be discarded and won't count toward your totals. Use this if you forgot to stop tracking."
											confirmLabel="Delete"
											variant="destructive"
											onConfirm={() => abandonSession(activeSession.id)}
										/>
									</div>
								) : (
									<Button
										size="lg"
										onClick={startWork}
										isLoading={submitting}
										className="w-36"
									>
										Start Work
									</Button>
								)}
							</div>

							<TodayStats />

							<SessionList />
						</>
					)}
				</div>
			</div>
		</div>
	)
}
