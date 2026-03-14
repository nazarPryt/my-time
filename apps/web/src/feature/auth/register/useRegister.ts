import { zodResolver } from '@hookform/resolvers/zod'
import { type RegisterRequest, RegisterRequestSchema } from '@my-time/api'
import { useForm } from 'react-hook-form'
import { api } from '@/shared/lib/api.ts'

const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function useRegister() {
	const form = useForm<RegisterRequest>({
		resolver: zodResolver(RegisterRequestSchema),
		defaultValues: { timezone: detectedTimezone },
	})

	async function onSubmit(data: RegisterRequest) {
		const { data: res, error } = await api.auth.register.post(data)
		if (error) {
			// TODO: surface error.value.message
			return
		}
		// TODO: store res.tokens, navigate to app
		console.log('registered:', res.user)
	}

	return { form, onSubmit }
}
