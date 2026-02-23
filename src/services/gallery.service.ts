import { supabase } from '@/lib/supabase'

export interface GalleryItem {
  id: string
  url: string
  title: string | null
  description: string | null
  event_id: string | null
  is_featured: boolean
  order: number
  created_at: string
}

export interface GalleryFolder {
  eventId: string
  eventName: string
  itemCount: number
  coverImage: string
}

export class GalleryService {
  static async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          events!inner(title)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar galeria:', error)
      return []
    }
  }

  static async getGalleryItemsByEvent(eventId: string): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          *,
          events!inner(title)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar galeria por evento:', error)
      return []
    }
  }

  static async getUniqueEvents(): Promise<GalleryFolder[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select(`
          event_id,
          events!inner(title)
        `)

      if (error) {
        throw error
      }

      // Agrupar por evento
      const eventMap = new Map<string, { count: number; title: string; firstImage: string }>()
      
      for (const item of data || []) {
        const eventId = item.event_id
        const eventTitle = (item as any).events?.title || 'Evento'
        
        if (eventId) {
          if (!eventMap.has(eventId)) {
            eventMap.set(eventId, { 
              count: 0, 
              title: eventTitle,
              firstImage: ''
            })
          }
          eventMap.get(eventId)!.count++
        }
      }

      // Obter a primeira imagem de cada evento
      Array.from(eventMap.keys()).forEach(async (eventId) => {
        const { data: firstImage } = await supabase
          .from('gallery')
          .select('url')
          .eq('event_id', eventId)
          .limit(1)
          .single()

        if (firstImage) {
          eventMap.get(eventId)!.firstImage = firstImage.url
        }
      })

      // Criar array de pastas
      const folderList: GalleryFolder[] = Array.from(eventMap.entries()).map(([eventId, info]) => ({
        eventId,
        eventName: info.title,
        itemCount: info.count,
        coverImage: info.firstImage,
      }))

      return folderList
    } catch (error) {
      console.error('Erro ao buscar eventos únicos:', error)
      return []
    }
  }

  static async downloadEventImages(eventId: string, eventName: string): Promise<void> {
    try {
      const items = await this.getGalleryItemsByEvent(eventId)
      
      // Baixar cada imagem individualmente
      items.forEach((item, index) => {
        const link = document.createElement('a')
        link.href = item.url
        link.download = `${eventName.replace(/\s+/g, '_')}_${index + 1}.jpg`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    } catch (error) {
      console.error('Erro ao baixar imagens do evento:', error)
      throw error
    }
  }
}