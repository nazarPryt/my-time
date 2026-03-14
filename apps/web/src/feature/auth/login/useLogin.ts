import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginRequest, LoginRequestSchema } from '@my-time/api'
import { useForm } from 'react-hook-form'
import { api } from '@/shared/lib/api.ts'

export function useLogin() {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(LoginRequestSchema),
	})

	async function onSubmit(data: LoginRequest) {
		const { data: res, error } = await api.auth.login.post(data)
		if (error) {
			// TODO: surface error.value.message (toast / form error)
			return
		}
		// TODO: store res.tokens, navigate to app
		console.log('logged in:', res.user)
	}

	return { form, onSubmit }
}
