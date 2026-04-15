import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/shared/lib/auth-context'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(protected)" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
