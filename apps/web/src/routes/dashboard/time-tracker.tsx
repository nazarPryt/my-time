import { createFileRoute } from '@tanstack/react-router'
import type { SessionResponse, TodaySummaryResponse } from 'contracts'
import { differenceInSeconds, format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { api } from '@/shared/lib/api'
import { cn } from '@/shared/lib/cn'

export const Route = createFileRoute('/dashboard/time-tracker')({
	component: TimeTrackerPage,
})

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatElapsed(seconds: number) {
	const s = Math.max(0, seconds)
	const h = Math.floor(s / 3600)
	const m = Math.floor((s % 3600) / 60)
	const sec = s % 60
	if (h > 0)
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
	return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function formatDuration(seconds: number) {
	if (seconds < 60) return `${seconds}s`
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
	return `${m}m`
}

function TimeTrackerPage() {
	const [activeSession, setActiveSession] = useState<SessionResponse | null>(
		null,
	)
	const [todaySummary, setTodaySummary] = useState<TodaySummaryResponse | null>(
		null,
	)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [, forceUpdate] = useState(false)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const fetchData = useCallback(async (signal?: AbortSignal) => {
		const [{ data: active }, { data: today }] = await Promise.all([
			api['time-tracker'].active.get({ fetch: { signal } }),
			api['time-tracker'].today.get({ fetch: { signal } }),
		])
		if (signal?.aborted) return
		setActiveSession(active ?? null)
		setTodaySummary(today ?? null)
		setLoading(false)
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		void fetchData(controller.signal)
		return () => controller.abort()
	}, [fetchData])

	// Tick every second while a session is active to keep the timer live
	useEffect(() => {
		if (activeSession) {
			intervalRef.current = setInterval(() => forceUpdate((b) => !b), 1000)
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [activeSession])

	const elapsedSeconds = activeSession
		? differenceInSeconds(new Date(), activeSession.startedAt)
		: 0

	// Ring pulses once per minute while working
	const progress = activeSession ? (elapsedSeconds % 60) / 60 : 0
	const strokeOffset = CIRCUMFERENCE * (1 - progress)

	const startWork = async () => {
		if (submitting) return
		setSubmitting(true)
		const { data, error } = await api['time-tracker'].start.post({
			type: 'work',
		})
		if (!error && data) setActiveSession(data)
		setSubmitting(false)
	}

	const stopWork = async () => {
		if (!activeSession || submitting) return
		setSubmitting(true)
		await api['time-tracker']({ id: activeSession.id }).end.patch()
		setActiveSession(null)
		const { data: today } = await api['time-tracker'].today.get()
		setTodaySummary(today ?? null)
		setSubmitting(false)
	}

	const deleteSession = async () => {
		if (!activeSession || submitting) return
		setSubmitting(true)
		await api['time-tracker']({ id: activeSession.id }).delete()
		setActiveSession(null)
		const { data: today } = await api['time-tracker'].today.get()
		setTodaySummary(today ?? null)
		setSubmitting(false)
	}

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
											{formatElapsed(elapsedSeconds)}
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
											onConfirm={deleteSession}
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

							{todaySummary && (
								<div className="grid grid-cols-3 gap-3">
									<StatCard
										label="Today"
										value={
											formatDuration(todaySummary.totalWorkSeconds) || '0m'
										}
									/>
									<StatCard
										label="Sessions"
										value={String(todaySummary.sessionsCompleted)}
									/>
									<StatCard
										label="Longest"
										value={
											todaySummary.longestSessionSeconds > 0
												? formatDuration(todaySummary.longestSessionSeconds)
												: '—'
										}
									/>
								</div>
							)}

							{todaySummary && todaySummary.sessions.length > 0 && (
								<div className="rounded-xl border border-border bg-card overflow-hidden">
									<div className="px-5 py-3 border-b border-border">
										<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
											Today's Sessions
										</span>
									</div>
									<div className="divide-y divide-border">
										{todaySummary.sessions.map((session) => (
											<SessionRow key={session.id} session={session} />
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

function SessionRow({ session }: { session: SessionResponse }) {
	const abandoned = session.abandonedAt !== null
	const endedAt = session.endedAt
	const completed = endedAt !== null && !abandoned
	const durSec = completed
		? differenceInSeconds(endedAt, session.startedAt)
		: null

	return (
		<div className="flex items-center justify-between px-5 py-3">
			<span className="text-sm text-foreground font-mono tabular-nums">
				{format(session.startedAt, 'HH:mm')}
			</span>
			<div className="flex items-center gap-2">
				{abandoned && (
					<span className="text-xs text-muted-foreground">abandoned</span>
				)}
				{!completed && !abandoned && (
					<Badge variant="secondary" className="text-[10px] h-5 px-1.5">
						Active
					</Badge>
				)}
				{durSec !== null && (
					<span className="text-sm text-muted-foreground font-mono tabular-nums">
						{formatDuration(durSec)}
					</span>
				)}
			</div>
		</div>
	)
}

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-border bg-card px-4 py-3.5">
			<div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
				{label}
			</div>
			<div className="text-xl font-semibold text-foreground tabular-nums">
				{value}
			</div>
		</div>
	)
}
