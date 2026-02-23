'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketService } from '@/services/ticket.service';
import { Button } from '@/components/ui/Button';
import { QrCode, CheckCircle, XCircle, Camera, RotateCcw } from 'lucide-react';

export function TicketValidator() {
  const [qrCode, setQrCode] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);

  const validateTicket = async () => {
    if (!qrCode.trim()) return;

    setLoading(true);
    try {
      const result = await TicketService.validateTicket(qrCode.trim());
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        valid: false,
        error: 'Erro ao validar ingresso'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetValidation = () => {
    setQrCode('');
    setValidationResult(null);
    setUseCamera(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Validador de Ingressos</h1>
          <p className="text-gray-300">Escaneie ou digite o código QR do ingresso</p>
        </motion.div>

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30">
          {!validationResult ? (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => setUseCamera(!useCamera)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-neon-lg transition-all duration-300"
                >
                  <Camera className="w-5 h-5" />
                  <span>{useCamera ? 'Digitar Código' : 'Usar Câmera'}</span>
                </button>
              </div>

              {useCamera ? (
                <div className="text-center">
                  <div className="bg-black rounded-lg p-8 mb-4">
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                      <Camera className="w-16 h-16 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Acesso à câmera será solicitado ao clicar em "Iniciar Escaneamento"
                  </p>
                  <Button className="mt-4">
                    Iniciar Escaneamento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Código QR do Ingresso
                    </label>
                    <textarea
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Cole ou digite o código QR aqui..."
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    onClick={validateTicket}
                    disabled={!qrCode.trim() || loading}
                    fullWidth
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Validando...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Validar Ingresso
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6"
              >
                {validationResult.valid ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-green-400 mb-2">Ingresso Válido!</h2>
                      <p className="text-gray-300">
                        {validationResult.eventTitle && (
                          <span className="block mb-2">
                            <strong>Evento:</strong> {validationResult.eventTitle}
                          </span>
                        )}
                        {validationResult.customerName && (
                          <span className="block">
                            <strong>Cliente:</strong> {validationResult.customerName}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                      <p className="text-green-400 font-medium">
                        ✓ Ingresso validado com sucesso!
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        O ingresso foi marcado como utilizado.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto"
                    >
                      <XCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-red-400 mb-2">Ingresso Inválido</h2>
                      <p className="text-gray-300">
                        {validationResult.error || 'Este ingresso não pode ser validado.'}
                      </p>
                    </div>
                    
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                      <p className="text-red-400 font-medium">
                        ✗ Verifique o código e tente novamente
                      </p>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={resetValidation}
                  variant="secondary"
                  fullWidth
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Validar Outro Ingresso
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}