'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { VipService } from '@/services/vip.service';
import { Crown, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

interface VipLoginProps {
  onSuccess?: () => void;
}

export function VipLogin({ onSuccess }: VipLoginProps) {
  const { login, isLoading: authLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      if (user) {
        // Verificar se usuário é VIP
        const isVip = await VipService.isVip(user.id);
        
        if (!isVip) {
          setError('Esta área é exclusiva para membros VIP. Junte-se à lista VIP primeiro.');
          return;
        }

        onSuccess?.();
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Área VIP</h1>
            <p className="text-gray-300">Acesso exclusivo para membros VIP</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || authLoading}
              fullWidth
              size="lg"
              variant="primary"
            >
              {loading || authLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Entrar na Área VIP
                </div>
              )}
            </Button>
          </form>

          {/* Benefits Preview */}
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-800/20 to-orange-800/20 rounded-lg border border-yellow-500/30">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Benefícios VIP
            </h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Acesso antecipado a ingressos</li>
              <li>• Cupons de desconto exclusivos</li>
              <li>• Entrada preferencial</li>
              <li>• Suporte prioritário</li>
              <li>• Brindes em datas especiais</li>
            </ul>
          </div>

          {/* Not VIP yet */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Ainda não é VIP?{' '}
              <a href="/vip/join" className="text-yellow-400 hover:text-yellow-300 underline">
                Junte-se à lista VIP
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
