import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { PracticeNumberForm } from './practice-number-form'

type Props = {
	defaultValue: string
	submitting: boolean
	onSave: (practiceNumber: string) => void
}

export function PracticeNumberSection({
	defaultValue,
	submitting,
	onSave,
}: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Practice number</CardTitle>
				<CardDescription>
					The number used to check your permesso di soggiorno status.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<PracticeNumberForm
					defaultValue={defaultValue}
					submitting={submitting}
					onSave={onSave}
				/>
			</CardContent>
		</Card>
	)
}
