import { zodResolver } from '@hookform/resolvers/zod'
import {
	PRACTICE_NUMBER_HINT,
	type SetPracticeNumberRequest,
	SetPracticeNumberRequestSchema,
} from 'contracts'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
	defaultValue: string
	submitting: boolean
	onSave: (practiceNumber: string) => void
}

export function PracticeNumberForm({
	defaultValue,
	submitting,
	onSave,
}: Props) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SetPracticeNumberRequest>({
		resolver: zodResolver(SetPracticeNumberRequestSchema),
		defaultValues: { practiceNumber: defaultValue },
	})
	const [pendingValue, setPendingValue] = useState<string | null>(null)

	useEffect(() => {
		reset({ practiceNumber: defaultValue })
	}, [defaultValue, reset])

	function handleFormSubmit({ practiceNumber }: SetPracticeNumberRequest) {
		if (defaultValue && practiceNumber !== defaultValue) {
			setPendingValue(practiceNumber)
			return
		}
		onSave(practiceNumber)
	}

	function confirmOverride() {
		if (pendingValue === null) return
		onSave(pendingValue)
		setPendingValue(null)
	}

	return (
		<>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Field>
					<FieldLabel htmlFor="practiceNumber" className="sr-only">
						Practice number
					</FieldLabel>
					{!defaultValue && (
						<FieldDescription>{PRACTICE_NUMBER_HINT}</FieldDescription>
					)}
					<div className="flex gap-2">
						<Input
							id="practiceNumber"
							placeholder="e.g. ABC1234567"
							disabled={submitting}
							className="flex-1"
							{...register('practiceNumber')}
						/>
						<Button type="submit" disabled={submitting} isLoading={submitting}>
							Save
						</Button>
					</div>
					<FieldError errors={[errors.practiceNumber]} />
				</Field>
			</form>

			<ConfirmDialog
				open={pendingValue !== null}
				onOpenChange={(open) => !open && setPendingValue(null)}
				title="Replace practice number?"
				description={`This will replace your current practice number "${defaultValue}" with "${pendingValue}". Past check history stays, but automatic checks will use the new number.`}
				confirmLabel="Replace"
				onConfirm={confirmOverride}
			/>
		</>
	)
}
