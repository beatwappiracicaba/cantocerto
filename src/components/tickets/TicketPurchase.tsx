'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { TicketService } from '@/services/ticket.service';
import { VipService } from '@/services/vip.service';
import { Button } from '@/components/ui/Button';
import { Event, TicketType } from '@/types';
import { 
  Ticket, 
  CreditCard, 
  QrCode, 
  Barcode,
  User,
  Mail,
  Phone,
  Contact,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Minus,
  Crown,
  Tag
} from 'lucide-react';

interface TicketPurchaseProps {
  event: Event;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export function TicketPurchase({ event, onSuccess, onCancel }: TicketPurchaseProps) {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [step, setStep] = useState<'selection' | 'customer' | 'payment' | 'confirmation'>('selection');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('pix');
  const [useVipDiscount, setUseVipDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [isVip, setIsVip] = useState(false);
  const [vipLevel, setVipLevel] = useState<string>('');

  useEffect(() => {
    if (user) {
      checkVipStatus();
      // Pre-fill customer info
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const checkVipStatus = async () => {
    if (!user) return;
    
    const vipStatus = await VipService.isVip(user.id);
    if (vipStatus) {
      setIsVip(true);
      const vipData = await VipService.getVipData(user.id);
      if (vipData.data) {
        setVipLevel(vipData.data.vipLevel);
      }
    }
  };

  const handleTicketQuantityChange = (ticketTypeId: string, change: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketTypeId] || 0;
      const newQuantity = Math.max(0, current + change);
      
      // Check ticket type limits
      const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
      if (ticketType && newQuantity > 0) {
        if (newQuantity < ticketType.minPurchaseQuantity || newQuantity > ticketType.maxPurchaseQuantity) {
          return prev;
        }
      }
      
      return {
        ...prev,
        [ticketTypeId]: newQuantity
      };
    });
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return event.ticketTypes.reduce((total, ticketType) => {
      const quantity = selectedTickets[ticketType.id] || 0;
      return total + (ticketType.price * quantity);
    }, 0);
  };

  const getDiscountAmount = () => {
    let discount = 0;
    const total = getTotalPrice();
    
    if (useVipDiscount && isVip) {
      const vipDiscounts = { bronze: 0.05, silver: 0.10, gold: 0.15, platinum: 0.20 };
      const discountRate = vipDiscounts[vipLevel as keyof typeof vipDiscounts] || 0;
      discount += total * discountRate;
    }
    
    return discount;
  };

  const getFinalPrice = () => {
    return Math.max(0, getTotalPrice() - getDiscountAmount());
  };

  const handlePurchase = async () => {
    if (getTotalTickets() === 0) {
      setError('Selecione pelo menos um ingresso');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const ticketTypes = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

      const purchaseData = {
        eventId: event.id,
        ticketTypes,
        customerInfo,
        paymentMethod,
        useVipDiscount,
        couponCode: couponCode || undefined
      };

      const result = await TicketService.purchaseTickets(purchaseData, user?.id);

      if (result.success) {
        setOrderData(result);
        setStep('confirmation');
        onSuccess?.(result.order?.id || '');
      } else {
        setError(result.error || 'Erro ao processar compra');
      }
    } catch (err) {
      setError('Erro ao processar compra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderTicketSelection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-800/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            <p className="text-gray-300 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-gray-300 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Selecione seus ingressos</h3>
        
        {event.ticketTypes.map((ticketType) => {
          const quantity = selectedTickets[ticketType.id] || 0;
          const available = ticketType.quantity - ticketType.soldQuantity;
          
          return (
            <motion.div
              key={ticketType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{ticketType.name}</h4>
                  <p className="text-gray-400 text-sm">{ticketType.description}</p>
                  {ticketType.benefits && (
                    <p className="text-yellow-400 text-sm mt-1">{ticketType.benefits}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    R$ {ticketType.price.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {available} disponíveis
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTicketQuantityChange(ticketType.id, -1)}
                    disabled={quantity === 0}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleTicketQuantityChange(ticketType.id, 1)}
                    disabled={quantity >= available || quantity >= ticketType.maxPurchaseQuantity}
                    className="w-8 h-8 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {ticketType.requiresVip && (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Exclusivo VIP
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {isVip && (
        <div className="bg-gradient-to-r from-yellow-800/20 to-orange-800/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useVipDiscount}
              onChange={(e) => setUseVipDiscount(e.target.checked)}
              className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
            />
            <div className="flex items-center text-yellow-400">
              <Crown className="w-5 h-5 mr-2" />
              <span>Aplicar desconto VIP ({vipLevel})</span>
            </div>
          </label>
        </div>
      )}

      <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Total de Ingressos:</span>
          <span className="text-white font-semibold">{getTotalTickets()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Subtotal:</span>
          <span className="text-white">R$ {getTotalPrice().toLocaleString('pt-BR')}</span>
        </div>
        {getDiscountAmount() > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400">Desconto VIP:</span>
            <span className="text-green-400">-R$ {getDiscountAmount().toLocaleString('pt-BR')}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-xl font-bold border-t border-gray-600 pt-2">
          <span className="text-white">Total:</span>
          <span className="text-green-400">R$ {getFinalPrice().toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Informações do Comprador</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Nome Completo *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Telefone *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Contact className="w-4 h-4 inline mr-1" />
            CPF *
          </label>
          <input
            type="text"
            value={customerInfo.cpf}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, cpf: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="000.000.000-00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Cupom de Desconto (Opcional)
        </label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="CUPOM10"
        />
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Método de Pagamento</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setPaymentMethod('pix')}
          className={`p-4 rounded-xl border-2 transition-all ${
            paymentMethod === 'pix'
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }`}
        >
          <QrCode className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-white font-medium">PIX</div>
          <div className="text-gray-400 text-sm">Pagamento instantâneo</div>
        </button>
        
        <button
          onClick={() => setPaymentMethod('credit_card')}
          className={`p-4 rounded-xl border-2 transition-all ${
            paymentMethod === 'credit_card'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }`}
        >
          <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-medium">Cartão</div>
          <div className="text-gray-400 text-sm">Parcele em até 12x</div>
        </button>
        
        <button
          onClick={() => setPaymentMethod('boleto')}
          className={`p-4 rounded-xl border-2 transition-all ${
            paymentMethod === 'boleto'
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }`}
        >
          <Barcode className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <div className="text-white font-medium">Boleto</div>
          <div className="text-gray-400 text-sm">Pague em até 3 dias</div>
        </button>
      </div>

      <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4">Resumo da Compra</h4>
        
        <div className="space-y-2 mb-4">
          {Object.entries(selectedTickets)
            .filter(([_, quantity]) => quantity > 0)
            .map(([ticketTypeId, quantity]) => {
              const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
              if (!ticketType) return null;
              
              return (
                <div key={ticketTypeId} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {quantity}x {ticketType.name}
                  </span>
                  <span className="text-white">
                    R$ {(ticketType.price * quantity).toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Subtotal:</span>
          <span className="text-white">R$ {getTotalPrice().toLocaleString('pt-BR')}</span>
        </div>
        
        {getDiscountAmount() > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400">Desconto VIP:</span>
            <span className="text-green-400">-R$ {getDiscountAmount().toLocaleString('pt-BR')}</span>
          </div>
        )}
        
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-white">Total:</span>
            <span className="text-green-400">R$ {getFinalPrice().toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto"
      >
        <Ticket className="w-10 h-10 text-white" />
      </motion.div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Compra Realizada com Sucesso!</h3>
        <p className="text-gray-300">
          Seu pedido foi criado e está aguardando confirmação de pagamento.
        </p>
      </div>
      
      {orderData?.qrCode && paymentMethod === 'pix' && (
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
          <h4 className="text-lg font-semibold text-white mb-4">Pagamento via PIX</h4>
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-center text-black font-mono text-sm break-all">
              {orderData.qrCode}
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Copie o código PIX acima ou escaneie o QR code no seu aplicativo bancário.
          </p>
        </div>
      )}
      
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-white mb-4">Detalhes do Pedido</h4>
        <div className="text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Número do Pedido:</span>
            <span className="text-white font-mono">{orderData?.order?.id?.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Evento:</span>
            <span className="text-white">{event.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Pago:</span>
            <span className="text-green-400 font-semibold">
              R$ {getFinalPrice().toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button href="/my-tickets" fullWidth>
          Ver Meus Ingressos
        </Button>
        <Button href="/" variant="secondary" fullWidth>
          Voltar para Home
        </Button>
      </div>
    </div>
  );

  const steps = [
    { key: 'selection', label: 'Selecionar Ingressos', icon: Ticket },
    { key: 'customer', label: 'Dados Pessoais', icon: User },
    { key: 'payment', label: 'Pagamento', icon: CreditCard },
    { key: 'confirmation', label: 'Confirmação', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = steps.findIndex(s => s.key === step) === index;
              const isCompleted = steps.findIndex(s => s.key === step) > index;
              
              return (
                <div key={stepItem.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-purple-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-purple-400' :
                      isCompleted ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      {stepItem.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-gray-800"
          >
            {step === 'selection' && renderTicketSelection()}
            {step === 'customer' && renderCustomerInfo()}
            {step === 'payment' && renderPayment()}
            {step === 'confirmation' && renderConfirmation()}

            {error && (
              <div className="mt-6 bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {step !== 'confirmation' && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {step !== 'selection' && (
                  <Button
                    onClick={() => setStep(steps[steps.findIndex(s => s.key === step) - 1].key as any)}
                    variant="secondary"
                    fullWidth
                  >
                    Voltar
                  </Button>
                )}
                
                {step === 'selection' && (
                  <Button
                    onClick={onCancel}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                )}
                
                {(['selection','customer','payment'] as const).includes(step as any) && (
                  <Button
                    onClick={() => {
                      if (step === 'selection') {
                        if (getTotalTickets() === 0) {
                          setError('Selecione pelo menos um ingresso');
                          return;
                        }
                        setStep('customer');
                      } else if (step === 'customer') {
                        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.cpf) {
                          setError('Preencha todos os campos obrigatórios');
                          return;
                        }
                        setStep('payment');
                      } else if (step === 'payment') {
                        handlePurchase();
                      }
                    }}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </div>
                    ) : (
                      step === 'payment' ? 'Finalizar Compra' : 'Continuar'
                    )}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
