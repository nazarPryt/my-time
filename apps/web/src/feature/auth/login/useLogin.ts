import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { type LoginRequest, LoginRequestSchema } from 'contracts'
import { useForm } from 'react-hook-form'
import { api } from '@/shared/lib/api.ts'
import { tokenStorage } from '@/shared/lib/token-storage'

export function useLogin() {
	const navigate = useNavigate()
	const form = useForm<LoginRequest>({
		resolver: zodResolver(LoginRequestSchema),
	})

	async function onSubmit(data: LoginRequest) {
		const { data: res, error } = await api.auth.login.post(data)
		if (error) {
			form.setError('password', { message: error.value.message })
			return
		}
		tokenStorage.setAccessToken(res.tokens.accessToken)
		await navigate({ to: '/dashboard' })
	}

	return { form, onSubmit }
}
