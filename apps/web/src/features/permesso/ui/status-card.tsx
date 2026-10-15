import type { PermessoStatusResponse } from 'contracts'
import { formatDistanceToNow, formatISO, toDate } from 'date-fns'
import { FileCheck2 } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/ui/card'
import { PERMESSO_TEST_IDS } from '../testIds'

type Props = {
	status: PermessoStatusResponse
	checking: boolean
	onCheck: () => void
}

export function StatusCard({ status, checking, onCheck }: Props) {
	const hasPracticeNumber = !!status.practiceNumber

	return (
		<Card data-testid={PERMESSO_TEST_IDS.status}>
			<CardHeader className="flex flex-col gap-3 sm:grid sm:gap-1">
				<CardTitle className="flex items-center gap-2">
					<FileCheck2 size={16} className="text-muted-foreground shrink-0" />
					Permesso status
				</CardTitle>
				<CardAction className="w-full sm:w-auto">
					<Button
						size="sm"
						className="w-full min-h-10 sm:w-auto sm:min-h-0"
						data-testid={PERMESSO_TEST_IDS.check}
						onClick={onCheck}
						disabled={!hasPracticeNumber || checking}
						isLoading={checking}
					>
						Check now
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-3">
				<StatusMessage status={status} />
				<LastChecked checkedAt={status.lastCheckedAt} />
			</CardContent>
		</Card>
	)
}

function LastChecked({
	checkedAt,
}: {
	checkedAt: PermessoStatusResponse['lastCheckedAt'] | Date
}) {
	if (!checkedAt) return null

	const checkedDate = toDate(checkedAt)
	const relativeTime = formatDistanceToNow(checkedDate, {
		addSuffix: true,
	})

	return (
		<p className="text-xs text-muted-foreground">
			Last checked <time dateTime={formatISO(checkedDate)}>{relativeTime}</time>
		</p>
	)
}

function StatusMessage({ status }: { status: PermessoStatusResponse }) {
	if (!status.practiceNumber) {
		return (
			<p className="text-sm text-muted-foreground">
				Add your practice number below to start checking.
			</p>
		)
	}

	if (status.lastError) {
		return (
			<>
				<Badge variant="destructive">Check failed</Badge>
				<p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-anywhere">
					{status.lastError}
				</p>
			</>
		)
	}

	if (status.lastStatus) {
		return (
			<p className="rounded-lg border border-border bg-muted px-3 py-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap wrap-anywhere">
				{status.lastStatus}
			</p>
		)
	}

	return (
		<p className="text-sm text-muted-foreground">
			Not checked yet — click "Check now" to get your current status.
		</p>
	)
}
