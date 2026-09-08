import type { PermessoStatusResponse } from 'contracts'
import { formatDistanceToNow } from 'date-fns'
import { FileCheck2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

type Props = {
	status: PermessoStatusResponse
	checking: boolean
	onCheck: () => void
}

export function StatusCard({ status, checking, onCheck }: Props) {
	const hasPracticeNumber = !!status.practiceNumber

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileCheck2 size={16} className="text-muted-foreground" />
					Permesso status
				</CardTitle>
				<CardAction>
					<Button
						size="sm"
						onClick={onCheck}
						disabled={!hasPracticeNumber || checking}
						isLoading={checking}
					>
						Check now
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-3">
				{!hasPracticeNumber ? (
					<p className="text-sm text-muted-foreground">
						Add your practice number below to start checking.
					</p>
				) : status.lastError ? (
					<>
						<Badge variant="destructive">Check failed</Badge>
						<p className="text-sm text-muted-foreground">{status.lastError}</p>
					</>
				) : status.lastStatus ? (
					<Badge>{status.lastStatus}</Badge>
				) : (
					<p className="text-sm text-muted-foreground">
						Not checked yet — click "Check now" to get your current status.
					</p>
				)}

				{status.lastCheckedAt && (
					<p className="text-xs text-muted-foreground">
						Last checked{' '}
						{formatDistanceToNow(new Date(status.lastCheckedAt), {
							addSuffix: true,
						})}
					</p>
				)}
			</CardContent>
		</Card>
	)
}
