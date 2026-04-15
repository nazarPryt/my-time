import { type MeResponse } from 'contracts'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from './api-client'
import { tokenStorage } from './token-storage'

type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: MeResponse | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<MeResponse | null>(null)

  useEffect(() => {
    async function rehydrate() {
      try {
        const token = await tokenStorage.get()
        if (!token) return
        const { data } = await api.auth.me.get()
        if (data) setUser(data)
      } catch {
        await tokenStorage.clear()
      } finally {
        setIsLoading(false)
      }
    }
    rehydrate()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await api.auth.login.post({ email, password })
    if (error || !data) {
      throw new Error(
        error?.value && typeof error.value === 'object' && 'message' in error.value
          ? String(error.value.message)
          : 'Invalid email or password',
      )
    }
    await tokenStorage.save(data.tokens.accessToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await tokenStorage.clear()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}