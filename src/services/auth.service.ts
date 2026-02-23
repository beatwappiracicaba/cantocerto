import { supabase } from '@/lib/supabase'
import { User } from '@/types'

export interface AuthResponse {
  success: boolean
  user?: User | null
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  birthDate?: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const user = await this.getUserProfile(data.user.id)
        return { success: true, user }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' }
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            birth_date: data.birthDate,
            is_vip: false,
          })

        if (profileError) {
          return { success: false, error: 'Erro ao criar perfil' }
        }

        const user = await this.getUserProfile(authData.user.id)
        return { success: true, user }
      }

      return { success: false, error: 'Erro ao criar conta' }
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta' }
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut()
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        return await this.getUserProfile(user.id)
      }

      return null
    } catch (error) {
      return null
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        birth_date: data.birth_date || null,
        is_vip: data.is_vip,
        vip_since: data.vip_since || null,
        avatar_url: data.avatar_url || null,
        created_at: data.created_at,
        updated_at: data.updated_at,
        role: 'customer',
      }
    } catch (error) {
      return null
    }
  }

  static async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          birth_date: updates.birth_date,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      const user = await this.getUserProfile(userId)
      return { success: true, user }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' }
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro ao enviar email de recuperação' }
    }
  }

  static async updatePassword(data: UpdatePasswordData): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar senha' }
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    return { data, error }
  }
}

export const authService = AuthService
