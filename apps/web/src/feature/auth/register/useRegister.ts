import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { type RegisterRequest, RegisterRequestSchema } from 'contracts'
import { useForm } from 'react-hook-form'
import { api } from '@/shared/lib/api.ts'
import { tokenStorage } from '@/shared/lib/token-storage'
import { getAuthErrorMessage } from '../authErrorHandler'

export function useRegister() {
	const navigate = useNavigate()
	const form = useForm<RegisterRequest>({
		resolver: zodResolver(RegisterRequestSchema),
	})

	async function onSubmit(data: RegisterRequest) {
		const { data: res, error } = await api.auth.register.post(data)
		if (error) {
			console.error('Register error:', error.value)
			form.setError('email', { message: getAuthErrorMessage(error.value) })
			return
		}
		tokenStorage.setAccessToken(res.tokens.accessToken)
		await navigate({ to: '/dashboard' })
	}

	return { form, onSubmit }
}
