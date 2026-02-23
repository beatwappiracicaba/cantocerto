'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Download, FolderOpen, Calendar } from 'lucide-react'
import { GalleryService, GalleryItem, GalleryFolder } from '@/services/gallery.service'
import Image from 'next/image'

export function GallerySection() {
  const [folders, setFolders] = useState<GalleryFolder[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [eventImages, setEventImages] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  useEffect(() => {
    loadFolders()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      loadEventImages(selectedEvent)
    }
  }, [selectedEvent])

  const loadFolders = async () => {
    try {
      setIsLoading(true)
      const events = await GalleryService.getUniqueEvents()
      setFolders(events)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadEventImages = async (eventId: string) => {
    try {
      const images = await GalleryService.getGalleryItemsByEvent(eventId)
      setEventImages(images)
    } catch (error) {
      console.error('Erro ao carregar imagens do evento:', error)
    }
  }

  const handleDownloadEvent = async (eventId: string, eventName: string) => {
    try {
      setIsDownloading(eventId)
      await GalleryService.downloadEventImages(eventId, eventName)
    } catch (error) {
      console.error('Erro ao baixar imagens do evento:', error)
      alert('Erro ao baixar imagens. As fotos serão abertas em novas abas para download individual.')
    } finally {
      setIsDownloading(null)
    }
  }

  const handleBackToFolders = () => {
    setSelectedEvent(null)
    setEventImages([])
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando galeria...</p>
        </div>
      </section>
    )
  }

  if (selectedEvent) {
    const currentEvent = folders.find(f => f.eventId === selectedEvent)
    
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToFolders}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-white">{currentEvent?.eventName || 'Evento'}</h2>
            </div>
            <button
              onClick={() => currentEvent && handleDownloadEvent(selectedEvent, currentEvent.eventName)}
              disabled={isDownloading === selectedEvent}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{isDownloading === selectedEvent ? 'Baixando...' : 'Baixar Fotos'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.title || 'Foto do evento'}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-sm">{image.title || 'Foto do evento'}</p>
                    {image.description && (
                      <p className="text-gray-300 text-xs">{image.description}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{new Date(image.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Camera className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossa Galeria
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Reviva os melhores momentos dos nossos shows. Clique em um evento para visualizar e baixar as fotos.
          </p>
        </motion.div>

        {/* Galeria de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.eventId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedEvent(folder.eventId)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-800">
                <div className="aspect-video relative">
                  {folder.coverImage ? (
                    <Image
                      src={folder.coverImage}
                      alt={folder.eventName}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <FolderOpen className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold">{folder.eventName}</p>
                      <p className="text-gray-300 text-sm">{folder.itemCount} foto{folder.itemCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  {folder.eventName}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Camera className="w-4 h-4" />
                    <span>{folder.itemCount} foto{folder.itemCount !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownloadEvent(folder.eventId, folder.eventName)
                    }}
                    disabled={isDownloading === folder.eventId}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading === folder.eventId ? 'Baixando...' : 'Baixar'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma foto disponível no momento.</p>
            <p className="text-gray-500 mt-2">As fotos dos shows serão adicionadas em breve!</p>
          </div>
        )}
      </div>
    </section>
  )
}