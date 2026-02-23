'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulação de login
    console.log('Tentando login com:', { email, password })
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Lógica de autenticação virá aqui
    // Por enquanto, vamos apenas redirecionar para a home
    
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-yellow-500/30"
      >
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Crown className="w-16 h-16 text-yellow-400" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Acessar Painel</h1>
          <p className="text-gray-400">Entre com suas credenciais de acesso.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>
          )}

          <div>
            <Button type="submit" loading={loading} fullWidth size="lg">
              <LogIn className="w-5 h-5 mr-2" />
              Entrar
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <Link href="/recuperar-senha" passHref>
            <span className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline cursor-pointer">
              Esqueceu sua senha?
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
