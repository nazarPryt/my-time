import { HourToggle } from './hour-toggle'
import { ScheduleSummary } from './schedule-summary'

type Props = {
	checkHours: number[]
	disabled: boolean
	pendingHour: number | null
	onChange: (checkHours: number[], hour: number) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function ScheduleEditor({
	checkHours,
	disabled,
	pendingHour,
	onChange,
}: Props) {
	function enable(hour: number) {
		onChange([...checkHours, hour], hour)
	}

	function disable(hour: number) {
		onChange(
			checkHours.filter((h) => h !== hour),
			hour,
		)
	}

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-8 gap-1.5">
				{HOURS.map((hour) => (
					<HourToggle
						key={hour}
						hour={hour}
						active={checkHours.includes(hour)}
						pending={disabled && pendingHour === hour}
						onEnable={enable}
						onDisable={disable}
					/>
				))}
			</div>
			<ScheduleSummary checkHours={checkHours} />
		</div>
	)
}
