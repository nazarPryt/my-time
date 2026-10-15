import { PRACTICE_NUMBER_HINT } from 'contracts'
import { Button } from '@/shared/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { usePracticeNumberForm } from '../model/use-practice-number-form'
import { PERMESSO_TEST_IDS } from '../testIds'

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
		errors,
		onSubmit,
		pendingValue,
		confirmOverride,
		handleConfirmationOpenChange,
	} = usePracticeNumberForm({ defaultValue, onSave })

	return (
		<>
			<form onSubmit={onSubmit}>
				<Field>
					<FieldLabel htmlFor="practiceNumber" className="sr-only">
						Practice number
					</FieldLabel>
					{!defaultValue && (
						<FieldDescription>{PRACTICE_NUMBER_HINT}</FieldDescription>
					)}
					<div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
						<Input
							data-testid={PERMESSO_TEST_IDS.practiceInput}
							id="practiceNumber"
							placeholder="e.g. ABC1234567"
							disabled={submitting}
							className="min-w-0 flex-1 min-h-10 sm:min-h-0"
							{...register('practiceNumber')}
						/>
						<Button
							className="min-h-10 sm:min-h-0"
							data-testid={PERMESSO_TEST_IDS.practiceSave}
							type="submit"
							disabled={submitting}
							isLoading={submitting}
						>
							Save
						</Button>
					</div>
					<FieldError
						data-testid={PERMESSO_TEST_IDS.practiceError}
						errors={[errors.practiceNumber]}
					/>
				</Field>
			</form>

			<ConfirmDialog
				open={pendingValue !== null}
				onOpenChange={handleConfirmationOpenChange}
				title="Replace practice number?"
				description={`This will replace your current practice number "${defaultValue}" with "${pendingValue}". Past check history stays, but automatic checks will use the new number.`}
				confirmLabel="Replace"
				onConfirm={confirmOverride}
			/>
		</>
	)
}
