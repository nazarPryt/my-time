import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { api } from '@/shared/lib/api-client'
import { useAuth } from '@/shared/lib/auth-context'

type FetchStatus = 'idle' | 'loading' | 'ok' | 'error'

export default function DashboardScreen() {
	const { user, logout } = useAuth()
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [sessionCount, setSessionCount] = useState<number | null>(null)
	const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle')
	const [fetchError, setFetchError] = useState<string | null>(null)

	async function fetchToday() {
		setFetchStatus('loading')
		const { data, error } = await api['time-tracker'].today.get()
		if (error) {
			setFetchStatus('error')
			const val = error.value
			const msg =
				val && typeof val === 'object' && 'message' in val
					? String((val as { message: unknown }).message)
					: JSON.stringify(val)
			setFetchError(`${error.status} — ${msg}`)
		} else {
			setSessionCount(data.sessionsCompleted)
			setFetchStatus('ok')
		}
	}

	useEffect(() => {
		void fetchToday()
	}, [fetchToday])

	async function handleLogout() {
		setIsLoggingOut(true)
		try {
			await logout()
			router.replace('/(auth)/login')
		} catch {
			setIsLoggingOut(false)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.title}>Dashboard</Text>
					<Text style={styles.subtitle}>
						Welcome back{user?.name ? `, ${user.name}` : ''} 👋
					</Text>
				</View>
				<Pressable
					style={[
						styles.logoutButton,
						isLoggingOut && styles.logoutButtonDisabled,
					]}
					onPress={handleLogout}
					disabled={isLoggingOut}
				>
					<Text style={styles.logoutText}>
						{isLoggingOut ? 'Logging out…' : 'Logout'}
					</Text>
				</Pressable>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardLabel}>Today&apos;s sessions</Text>
				{fetchStatus === 'loading' && <ActivityIndicator color="#a5b4fc" />}
				{fetchStatus === 'ok' && (
					<Text style={styles.cardValue}>{sessionCount}</Text>
				)}
				{fetchStatus === 'error' && (
					<Text style={styles.cardError}>{fetchError}</Text>
				)}
				<Pressable
					style={[
						styles.refetchButton,
						fetchStatus === 'loading' && styles.logoutButtonDisabled,
					]}
					onPress={() => void fetchToday()}
					disabled={fetchStatus === 'loading'}
				>
					<Text style={styles.refetchText}>Refetch</Text>
				</Pressable>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#0f172a' },
	header: {
		backgroundColor: '#1e293b',
		paddingTop: 56,
		paddingBottom: 16,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: { fontSize: 20, fontWeight: '700', color: '#f1f5f9' },
	subtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
	logoutButton: {
		backgroundColor: '#1e1a4a',
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	logoutButtonDisabled: { opacity: 0.6 },
	logoutText: { color: '#a5b4fc', fontSize: 13 },
	card: {
		margin: 20,
		backgroundColor: '#1e293b',
		borderRadius: 12,
		padding: 20,
		gap: 8,
	},
	cardLabel: {
		fontSize: 12,
		color: '#64748b',
		textTransform: 'uppercase',
		letterSpacing: 0.8,
	},
	cardValue: { fontSize: 36, fontWeight: '700', color: '#f1f5f9' },
	cardError: { fontSize: 13, color: '#f87171' },
	refetchButton: {
		alignSelf: 'flex-start',
		marginTop: 4,
		backgroundColor: '#1e1a4a',
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	refetchText: { color: '#a5b4fc', fontSize: 13 },
})
