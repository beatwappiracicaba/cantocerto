'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Ticket, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Event } from '@/types'
import { EventService } from '@/services/event.service'

export function EventsListing() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<string>('')

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedTheme])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const { events, error } = await EventService.getActiveEvents()
      
      if (error) {
        setError(error)
      } else {
        setEvents(events)
      }
    } catch (err) {
      setError('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by theme
    if (selectedTheme) {
      filtered = filtered.filter(event => event.specialEventTheme === selectedTheme)
    }

    setFilteredEvents(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getLowestPrice = (ticketTypes: Event['ticketTypes']) => {
    if (!ticketTypes || ticketTypes.length === 0) return 0
    return Math.min(...ticketTypes.map(ticket => ticket.price))
  }

  const themes = [
    { value: '', label: 'Todos os Temas' },
    { value: 'neon', label: 'Neon' },
    { value: 'gold', label: 'Gold' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'halloween', label: 'Halloween' },
    { value: 'new-year', label: 'Réveillon' },
    { value: 'carnival', label: 'Carnaval' },
  ]

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Eventos</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Descubra as melhores festas e shows de Piracicaba e região
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                <option value="">Todos os Temas</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded mb-4"></div>
                <div className="h-10 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Eventos</span>
            </h1>
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadEvents} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Eventos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubra as melhores festas e shows de Piracicaba e região
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select 
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gray-900 rounded-xl overflow-hidden hover:shadow-neon-lg transition-all duration-300"
            >
              {/* Event Theme Overlay */}
              {event.specialEventTheme && (
                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${
                  event.specialEventTheme === 'neon' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                  event.specialEventTheme === 'gold' ? 'bg-gradient-to-br from-yellow-600 to-orange-600' :
                  event.specialEventTheme === 'diamond' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
                  event.specialEventTheme === 'halloween' ? 'bg-gradient-to-br from-orange-600 to-red-600' :
                  event.specialEventTheme === 'new-year' ? 'bg-gradient-to-br from-gold-600 to-yellow-600' :
                  event.specialEventTheme === 'carnival' ? 'bg-gradient-to-br from-purple-600 to-blue-600' :
                  ''
                }`}></div>
              )}

              <div className="relative p-6">
                {/* Event Image */}
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                      <Ticket className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}
                  
                  {/* Event Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'upcoming' ? 'bg-green-600 text-white' :
                      event.status === 'ongoing' ? 'bg-blue-600 text-white' :
                      event.status === 'completed' ? 'bg-gray-600 text-white' :
                      event.status === 'cancelled' ? 'bg-red-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {event.status === 'upcoming' ? 'Em Breve' :
                       event.status === 'ongoing' ? 'Acontecendo' :
                       event.status === 'completed' ? 'Encerrado' :
                       event.status === 'cancelled' ? 'Cancelado' :
                       event.status}
                    </span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Date and Time */}
                <div className="flex items-center text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  <span className="text-sm">{formatTime(event.time)}</span>
                </div>

                {/* Event Location */}
                <div className="flex items-center text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>

                {/* Ticket Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">A partir de</span>
                    <div className="text-white font-bold">
                      R$ {getLowestPrice(event.ticketTypes)}
                    </div>
                  </div>
                  
                  {/* Sold Progress */}
                  {event.capacity > 0 && (
                    <div className="text-right">
                      <span className="text-gray-400 text-sm">
                        {event.soldTickets}/{event.capacity}
                      </span>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${Math.min((event.soldTickets / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  href={`/events/${event.slug}`}
                  variant="primary" 
                  className="w-full"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-900 rounded-xl p-8 max-w-md mx-auto">
              <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-400">Tente ajustar seus filtros de busca</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}