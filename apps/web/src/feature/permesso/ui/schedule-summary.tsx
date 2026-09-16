type Props = {
	checkHours: number[]
}

export function ScheduleSummary({ checkHours }: Props) {
	return (
		<p className="text-xs text-muted-foreground">
			{checkHours.length === 0
				? 'Automatic checks are off — use "Check now" instead.'
				: `Checked automatically at ${checkHours
						.map((h) => `${String(h).padStart(2, '0')}:00`)
						.join(', ')} (your local time).`}
		</p>
	)
}
