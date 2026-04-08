// Feature hook — auth state for the popup UI.
// Calls BLL only; never imports from dal/ or chrome APIs directly.

import { useCallback, useEffect, useState } from 'react'
import { isAuthenticated, login, logout } from '@/bll/auth/authService'

export interface UseAuthReturn {
	/** 'loading' while checking storage; 'authenticated' or 'unauthenticated' after. */
	status: 'loading' | 'authenticated' | 'unauthenticated'
	loginError: string | null
	submitting: boolean
	handleLogin: (email: string, password: string) => Promise<void>
	handleLogout: () => Promise<void>
}

export function useAuth(onLoginSuccess?: () => void): UseAuthReturn {
	const [status, setStatus] = useState<
		'loading' | 'authenticated' | 'unauthenticated'
	>('loading')
	const [loginError, setLoginError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		isAuthenticated().then((authenticated) => {
			setStatus(authenticated ? 'authenticated' : 'unauthenticated')
		})
	}, [])

	const handleLogin = useCallback(
		async (email: string, password: string) => {
			setSubmitting(true)
			setLoginError(null)
			const result = await login({ email, password })
			setSubmitting(false)
			if (!result.success) {
				setLoginError('Invalid email or password')
				return
			}
			setStatus('authenticated')
			onLoginSuccess?.()
		},
		[onLoginSuccess],
	)

	const handleLogout = useCallback(async () => {
		await logout()
		setStatus('unauthenticated')
	}, [])

	return { status, loginError, submitting, handleLogin, handleLogout }
}
