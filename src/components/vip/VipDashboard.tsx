'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { VipService } from '@/services/vip.service';
import { VipData } from '@/services/vip.service';
import { Button } from '@/components/ui/Button';
import { Crown, Gift, Calendar, Ticket, Star, Sparkles } from 'lucide-react';

export function VipDashboard() {
  const { user } = useAuth();
  const [vipData, setVipData] = useState<VipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingCoupon, setRedeemingCoupon] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadVipData();
    }
  }, [user]);

  const loadVipData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await VipService.getVipData(user.id);

      if (error) {
        setError(error);
      } else if (data) {
        setVipData(data);
      }
    } catch (err) {
      setError('Erro ao carregar dados VIP');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemCoupon = async (couponId: string) => {
    if (!user) return;

    try {
      setRedeemingCoupon(couponId);
      const { success, error } = await VipService.redeemCoupon(couponId, user.id);

      if (success) {
        // Recarregar dados após resgate
        await loadVipData();
      } else if (error) {
        alert(error);
      }
    } catch (err) {
      alert('Erro ao resgatar cupom');
    } finally {
      setRedeemingCoupon(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-yellow-800 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-400 text-lg font-semibold mb-2">Erro ao carregar área VIP</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={loadVipData} variant="secondary">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!vipData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Área VIP</h2>
          <p className="text-gray-300">Carregando informações...</p>
        </div>
      </div>
    );
  }

  const vipBenefits = VipService.getVipBenefits(vipData.vipLevel);
  const isVip = vipData.vipStatus?.isActive === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black py-20">
      <div className="container mx-auto px-4">
        {/* Header VIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Área VIP
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experiência exclusiva para membros VIP do Canto Certo
          </p>
        </motion.div>

        {/* Status VIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-800/30 to-yellow-600/30 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Status VIP: {isVip ? vipBenefits.name : 'Não VIP'}
              </h2>
              <p className="text-gray-300">
                {isVip ? 'Você é um membro VIP!' : 'Junte-se à lista VIP para desbloquear benefícios exclusivos'}
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${vipBenefits.color} flex items-center justify-center`}>
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          {isVip && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">R$ {vipData.totalSpent.toLocaleString('pt-BR')}</div>
                <div className="text-sm text-gray-300">Total Gasto</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{vipData.attendedEvents.length}</div>
                <div className="text-sm text-gray-300">Eventos Participados</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{vipBenefits.discount}%</div>
                <div className="text-sm text-gray-300">Desconto VIP</div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefícios VIP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              Benefícios {vipBenefits.name}
            </h3>
            <div className="space-y-3">
              {vipBenefits.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-3" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cupons Disponíveis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Gift className="w-5 h-5 text-green-400 mr-2" />
              Cupons Exclusivos ({vipData.coupons.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {vipData.coupons.length > 0 ? (
                vipData.coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-gradient-to-r from-green-800/20 to-emerald-800/20 rounded-lg p-4 border border-green-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{coupon.code}</h4>
                        <p className="text-sm text-gray-300">{coupon.description}</p>
                      </div>
                      <span className="text-lg font-bold text-green-400">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `R$ ${coupon.discount_value}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Válido até: {new Date(coupon.valid_until).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        onClick={() => handleRedeemCoupon(coupon.id)}
                        disabled={redeemingCoupon === coupon.id}
                        size="sm"
                        variant="secondary"
                      >
                        {redeemingCoupon === coupon.id ? 'Resgatando...' : 'Resgatar'}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhum cupom disponível no momento</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Próximos Eventos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            Próximos Eventos VIP
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vipData.upcomingEvents.length > 0 ? (
              vipData.upcomingEvents.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-yellow-800/20 to-yellow-600/20 rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-colors">
                  <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {new Date(event.date).toLocaleDateString('pt-BR')} - {event.time}
                  </p>
                  <p className="text-sm text-gray-400 mb-3">{event.location}</p>
                  <Button size="sm" variant="secondary" fullWidth>
                    <Ticket className="w-4 h-4 mr-1" />
                    Comprar com Desconto
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Nenhum evento programado no momento</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Histórico de Eventos */}
        {vipData.attendedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30"
          >
            <h3 className="text-xl font-bold text-white mb-6">Seu Histórico</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {vipData.attendedEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                  <div>
                    <h4 className="font-semibold text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400">✓ Participou</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
