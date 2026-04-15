import { useState } from 'react'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '@/shared/lib/auth-context'

export default function DashboardScreen() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
          <Text style={styles.subtitle}>Welcome back{user?.name ? `, ${user.name}` : ''} 👋</Text>
        </View>
        <Pressable
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text style={styles.logoutText}>{isLoggingOut ? 'Logging out…' : 'Logout'}</Text>
        </Pressable>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>🏗️</Text>
        <Text style={styles.placeholderTitle}>Dashboard content</Text>
        <Text style={styles.placeholderSub}>Coming soon</Text>
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
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderIcon: { fontSize: 40 },
  placeholderTitle: { fontSize: 15, fontWeight: '600', color: '#94a3b8' },
  placeholderSub: { fontSize: 12, color: '#475569' },
})