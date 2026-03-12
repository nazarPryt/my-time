import {
	type RegisterRequest,
	RegisterRequestSchema,
} from '@contracts/auth/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function useRegister() {
	const form = useForm<RegisterRequest>({
		resolver: zodResolver(RegisterRequestSchema),
		defaultValues: { timezone: detectedTimezone },
	})

	async function onSubmit(_data: RegisterRequest) {
		// TODO: wire up API call
	}

	return { form, onSubmit }
}
