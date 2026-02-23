'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { cn } from '@/utils'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])

  // Mock data - will be replaced with dynamic data from database
  const featuredVideo = {
    url: '/videos/hero-video.mp4',
    title: 'Canto Certo - A Experiência',
    description: 'A casa de shows mais premium de Piracicaba'
  }

  const nextEvent = {
    title: 'Green Valley Night',
    date: '2024-03-15',
    time: '22:00',
    lineup: ['DJ Alok', 'Vintage Culture', 'Chemical Surf']
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity, scale }}
      >
        <video
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={featuredVideo.url}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-transparent to-yellow-700/20" />
      </motion.div>

      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-8xl font-bold text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-neon-pulse">
                  Canto Certo
                </span>
                <span className="block text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mt-2">
                  A Casa de Shows de Piracicaba
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                O melhor forró da região, com shows inesquecíveis e a noite mais animada de Piracicaba.
                Venha viver momentos que ficarão para sempre em sua memória.
              </motion.p>
            </div>

            {/* Next Event Preview */}
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="card-luxury p-6 backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="text-neon text-sm uppercase tracking-wider font-semibold">
                    Próximo Evento
                  </div>
                  <h3 className="text-2xl font-bold text-white">{nextEvent.title}</h3>
                  <div className="text-gray-300">
                    <div>{new Date(nextEvent.date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })} • {nextEvent.time}</div>
                  </div>
                  <div className="text-sm text-yellow-400">
                    {nextEvent.lineup.join(' • ')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Button
                href="/events"
                size="lg"
                className="btn-premium text-lg px-8 py-4"
              >
                Comprar Ingresso
              </Button>
              <Button
                href="/vip"
                variant="outline"
                size="lg"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
              >
                Lista VIP
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white opacity-50" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-30"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-600 rounded-full opacity-40"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </section>
  )
}