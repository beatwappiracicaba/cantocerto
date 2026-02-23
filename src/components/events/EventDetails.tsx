'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, Star, Info, Ticket, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Event } from '@/types'
import { formatDate, formatTime } from '@/utils'

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  const [selectedTicketType, setSelectedTicketType] = useState<string>('')
  const [ticketQuantity, setTicketQuantity] = useState(1)

  const totalCapacity = event.capacity
  const soldTickets = event.soldTickets
  const availableTickets = Math.max(totalCapacity - soldTickets, 0)
  const soldPercentage = totalCapacity > 0 ? (soldTickets / totalCapacity) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Banner */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/placeholder-event-large.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
        
        {/* Special Event Badge */}
        {event.isSpecialEvent && (
          <div className="absolute top-8 left-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Evento Especial</span>
            </div>
          </div>
        )}

        {/* Event Title */}
        <div className="absolute bottom-8 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>{formatTime(event.time)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{event.venue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card-luxury p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Sobre o Evento</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </motion.div>

            {/* Lineup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card-luxury p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Line-up</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.lineup.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/placeholder-artist.jpg'
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                      {artist.bio && (
                        <p className="text-gray-400 text-sm">{artist.bio}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card-luxury p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Destaques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.highlights?.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Policies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="card-luxury p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Info className="w-6 h-6 mr-2 text-purple-400" />
                Informações Importantes
              </h2>
              <ul className="space-y-3">
                {event.policies?.map((policy, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{policy}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Purchase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card-luxury p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-purple-400" />
                Comprar Ingressos
              </h3>

              {/* Ticket Availability */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Disponibilidade</span>
                  <span>{soldTickets}/{availableTickets + soldTickets}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${soldPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-purple-400 mt-1">
                  {Math.round(soldPercentage)}% vendido
                </div>
              </div>

              {/* Ticket Type Selection */}
              <div className="space-y-3 mb-6">
                {event.ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTicketType === ticketType.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedTicketType(ticketType.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{ticketType.name}</h4>
                        <p className="text-sm text-gray-400">{ticketType.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          R$ {ticketType.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.max(ticketType.quantity - ticketType.soldQuantity, 0)} disponíveis
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticketType.soldQuantity} vendidos
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity Selection */}
              {selectedTicketType && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantidade
                  </label>
                  <select
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Number(e.target.value))}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'ingresso' : 'ingressos'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Total */}
              {selectedTicketType && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-xl font-bold text-white">
                      R$ {event.ticketTypes.find(t => t.id === selectedTicketType)?.price! * ticketQuantity}
                    </span>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <Button
                variant="primary"
                className="w-full"
                disabled={!selectedTicketType}
                onClick={() => {
                  // Navigate to checkout
                  console.log('Comprar ingressos:', { ticketType: selectedTicketType, quantity: ticketQuantity })
                }}
              >
                <QrCode className="w-5 h-5 mr-2" />
                Comprar Agora
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Pagamento seguro • Cancelamento gratuito até 24h antes
              </p>
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="card-luxury p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Informações do Evento</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <div>
                    <div>{event.venue}</div>
                    <div className="text-gray-500">{event.address}, {event.city} - {event.state}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Lotação: {event.capacity} pessoas</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
