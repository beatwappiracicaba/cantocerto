'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, UserRole } from '@/types'
import { authService } from '@/services/auth.service'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  hasRole: (role: UserRole) => boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()

    const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await authService.getUserProfile(session.user.id)
        setUser(userProfile)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      // Para outros eventos como USER_UPDATED, podemos querer recarregar o perfil
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        throw new Error(response.error || 'Erro ao fazer login')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        throw new Error(response.error || 'Erro ao criar conta')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await authService.updateProfile(user.id, updates)
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        throw new Error(response.error || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const hasRole = useCallback((role: UserRole) => {
    return user?.role === role
  }, [user])

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
  }
}