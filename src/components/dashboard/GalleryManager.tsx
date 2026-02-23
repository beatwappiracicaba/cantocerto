'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Image as ImageIcon, Trash2, Download, Eye, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { GalleryItem } from '@/services/gallery.service'

interface GalleryManagerProps {
  onItemAdded: (item: GalleryItem) => void
  onItemDeleted: (id: string) => void
}

export function GalleryManager({ onItemAdded, onItemDeleted }: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventId, setEventId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [order, setOrder] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([])

  // Função para buscar eventos
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('date', { ascending: false })

      if (error) {
        console.error('Erro ao buscar eventos:', error)
      } else {
        setEvents(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    }
  }

  // Função para buscar itens da galeria
  const fetchGalleryItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          events!inner(title)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar galeria:', error)
      } else {
        setGalleryItems(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar galeria:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGalleryItems()
    fetchEvents()
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione uma imagem.')
      return
    }

    setUploading(true)
    try {
      // Fazer upload da imagem para o Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Obter a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      // Salvar os metadados no banco de dados
      const { data, error: dbError } = await supabase
        .from('gallery')
        .insert([
          {
            url: publicUrl,
            title: title || null,
            description: description || null,
            event_id: eventId || null,
            is_featured: isFeatured,
            order: order,
          }
        ])
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      // Atualizar a lista local
      const newItem = data as GalleryItem
      setGalleryItems([newItem, ...galleryItems])
      onItemAdded(newItem)

      // Limpar formulário
      setTitle('')
      setDescription('')
      setEventId('')
      setIsFeatured(false)
      setOrder(0)
      setFile(null)
      setPreview(null)

      alert('Imagem enviada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) {
      return
    }

    try {
      // Primeiro, obter a URL da imagem para deletar do storage
      const { data: itemData, error: fetchError } = await supabase
        .from('gallery')
        .select('url')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Deletar do banco de dados
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (dbError) {
        throw dbError
      }

      // Deletar do storage
      if (itemData?.url) {
        const fileName = itemData.url.split('/').pop()
        if (fileName) {
          const filePath = `gallery/${fileName}`
          await supabase.storage.from('gallery').remove([filePath])
        }
      }

      // Atualizar a lista local
      setGalleryItems(galleryItems.filter(item => item.id !== id))
      onItemDeleted(id)

      alert('Imagem excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir imagem:', error)
      alert('Erro ao excluir imagem.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Upload */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Adicionar Nova Imagem
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Título da imagem"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Descrição da imagem"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Evento
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Selecione um evento</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mr-2"
                />
                Destacar imagem
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordem de exibição
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagem
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileSelect(file)
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {preview ? (
                    <div className="relative">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={200}
                        height={150}
                        className="mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setPreview(null)
                          setFile(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>Clique para selecionar uma imagem</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-yellow-500 text-black hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar Imagem
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Lista de Imagens */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Imagens da Galeria ({galleryItems.length})
        </h3>
        
        {galleryItems.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhuma imagem na galeria ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden group relative">
                <Image
                  src={item.url}
                  alt={item.title || 'Imagem da galeria'}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-3">
                  <h4 className="text-white font-medium truncate">{item.title || 'Sem título'}</h4>
                  <p className="text-gray-400 text-sm">{new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {item.is_featured && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                          Destaque
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">Ordem: {item.order}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => window.open(item.url, '_blank')}
                        className="text-gray-400 hover:text-white p-1"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}