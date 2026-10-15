import { zodResolver } from '@hookform/resolvers/zod'
import {
	type SetPracticeNumberRequest,
	SetPracticeNumberRequestSchema,
} from 'contracts'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type Options = {
	defaultValue: string
	onSave: (practiceNumber: string) => void
}

export function usePracticeNumberForm({ defaultValue, onSave }: Options) {
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

	function handleConfirmationOpenChange(open: boolean) {
		if (!open) setPendingValue(null)
	}

	return {
		register,
		errors,
		onSubmit: handleSubmit(handleFormSubmit),
		pendingValue,
		confirmOverride,
		handleConfirmationOpenChange,
	}
}
