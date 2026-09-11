import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ScheduleEditor } from './schedule-editor'

type Props = {
	checkHours: number[]
	disabled: boolean
	pendingHour: number | null
	onChange: (checkHours: number[], hour: number) => void
}

export function ScheduleSection({
	checkHours,
	disabled,
	pendingHour,
	onChange,
}: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Automatic checks</CardTitle>
				<CardDescription>
					Pick which hours of the day to check automatically.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ScheduleEditor
					checkHours={checkHours}
					disabled={disabled}
					pendingHour={pendingHour}
					onChange={onChange}
				/>
			</CardContent>
		</Card>
	)
}
