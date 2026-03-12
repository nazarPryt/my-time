import { type LoginRequest, LoginRequestSchema } from '@contracts/auth/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export function useLogin() {
	const form = useForm<LoginRequest>({
		resolver: zodResolver(LoginRequestSchema),
	})

	async function onSubmit(_data: LoginRequest) {
		// TODO: wire up API call
	}

	return { form, onSubmit }
}
