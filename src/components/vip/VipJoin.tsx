'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { VipService } from '@/services/vip.service';
import { Button } from '@/components/ui/Button';
import { Crown, Phone, User, Mail, CheckCircle, Sparkles } from 'lucide-react';

export function VipJoin() {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Você precisa estar logado para entrar na lista VIP');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { success, error } = await VipService.joinVipList(user.id, phone);

      if (success) {
        setSuccess(true);
      } else if (error) {
        setError(error);
      }
    } catch (err) {
      setError('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo à Lista VIP!</h2>
            <p className="text-gray-300 mb-6">
              Você agora faz parte do grupo exclusivo de clientes VIP do Canto Certo. 
              Prepare-se para desfrutar de benefícios incríveis!
            </p>
            <div className="bg-gradient-to-r from-yellow-800/20 to-orange-800/20 rounded-lg p-4 mb-6 border border-yellow-500/30">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Seus Benefícios VIP
              </h3>
              <ul className="text-xs text-gray-300 space-y-1 text-left">
                <li>• Acesso antecipado a ingressos</li>
                <li>• Cupons de desconto exclusivos</li>
                <li>• Entrada preferencial</li>
                <li>• Suporte prioritário</li>
                <li>• Brindes em datas especiais</li>
              </ul>
            </div>
            <Button href="/vip" fullWidth>
              Acessar Área VIP
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">Junte-se à Lista VIP</h1>
            <p className="text-gray-300 text-lg">
              Torne-se um membro exclusivo e desfrute de benefícios premium
            </p>
          </div>

          {!user && (
            <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-center">
                Você precisa estar logado para entrar na lista VIP.{' '}
                <a href="/login" className="underline hover:text-yellow-300">
                  Faça login aqui
                </a>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {user && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">Logado como:</span>
                </div>
                <p className="text-white">{user.name || user.email}</p>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Telefone (Opcional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Usado para envio de notificações VIP e brindes especiais
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !user}
              fullWidth
              size="lg"
              variant="primary"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Entrar para Lista VIP
                </div>
              )}
            </Button>
          </form>

          {/* Benefits Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-800/20 to-pink-800/20 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Benefícios Bronze
              </h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• 5% de desconto em ingressos</li>
                <li>• Acesso antecipado</li>
                <li>• Cupons exclusivos</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-800/20 to-orange-800/20 rounded-lg p-4 border border-yellow-500/30">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                Suba de Nível
              </h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Prata: R$ 500+ (10% off)</li>
                <li>• Ouro: R$ 2.000+ (15% off)</li>
                <li>• Platina: R$ 5.000+ (20% off)</li>
                <li>• Benefícios exclusivos</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}