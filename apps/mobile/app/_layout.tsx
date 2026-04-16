import { Stack } from 'expo-router'
import { AuthProvider } from '@/shared/lib/auth-context'

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }} />
		</AuthProvider>
	)
}
