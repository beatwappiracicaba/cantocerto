'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Gift, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export function VIPSection() {
  const { user } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const benefits = [
    {
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
      title: 'Acesso VIP Exclusivo',
      description: 'Entrada prioritária e áreas VIP reservadas'
    },
    {
      icon: <Gift className="w-8 h-8 text-yellow-500" />,
      title: 'Cupons Especiais',
      description: 'Descontos exclusivos e ofertas especiais'
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
      title: 'Pré-venda Antecipada',
      description: 'Compre ingressos antes do público geral'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: 'Benefícios de Aniversário',
      description: 'Surpresas especiais no seu aniversário'
    }
  ]

  return (
    <section id="vip" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full blur opacity-25"></div>
                <Crown className="w-16 h-16 text-yellow-400 relative z-10" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lista <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">VIP</span>
            </h2>
            <p className="text-xl text-gray-400">
              Junte-se à lista VIP e tenha acesso a benefícios exclusivos
            </p>
          </motion.div>

          {/* VIP Status */}
          {isClient && user?.is_vip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-luxury p-8 mb-12 text-center"
            >
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Você é VIP!</h3>
              <p className="text-gray-300 mb-4">
                Membro VIP desde {user.vip_since && new Date(user.vip_since).toLocaleDateString('pt-BR')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/vip/coupons" variant="secondary">
                  Meus Cupons
                </Button>
                <Button href="/vip/events" variant="outline">
                  Eventos VIP
                </Button>
              </div>
            </motion.div>
          )}

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-luxury p-6 text-center group hover:border-purple-500 transition-colors"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            {isClient && !user ? (
              <div className="space-y-4">
                <Button
                  href="/register"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Entrar para Lista VIP
                </Button>
                <p className="text-gray-400">
                  Já tem uma conta? <a href="/login" className="text-purple-400 hover:text-purple-300">Entrar</a>
                </p>
              </div>
            ) : isClient && !user?.is_vip && (
              <Button
                href="/vip/join"
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Tornar-se VIP
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}