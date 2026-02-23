import { supabase } from '@/lib/supabase'
import { Event, EventStatus, SpecialEventTheme } from '@/types'

export interface EventsResponse {
  events: Event[]
  error: string | null
}

export interface EventResponse {
  event: Event | null
  error: string | null
}

export class EventService {
  /**
   * Busca todos os eventos ativos ordenados por data
   */
  static async getActiveEvents(): Promise<EventsResponse> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          ticket_types (*)
        `)
        .eq('status', 'upcoming')
        .order('date', { ascending: true })

      if (error) {
        return { events: [], error: error.message }
      }

      const events: Event[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        address: event.address,
        city: event.city,
        state: event.state,
        zipCode: event.zip_code,
        location: `${event.venue}, ${event.city} - ${event.state}`,
        bannerUrl: event.banner_url,
        imageUrl: event.banner_url,
        videoUrl: event.video_url || undefined,
        capacity: event.capacity,
        soldTickets: event.sold_tickets || 0,
        status: event.status as EventStatus,
        isActive: event.is_active,
        isFeatured: event.is_featured || false,
        isSpecialEvent: event.is_special_event || false,
        specialEventTheme: event.special_event_theme as SpecialEventTheme,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        lineup: (event as any).lineup || [],
        highlights: (event as any).highlights || [],
        policies: (event as any).policies || [],
        ticketTypes: event.ticket_types?.map(ticket => ({
          id: ticket.id,
          eventId: ticket.event_id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          originalPrice: ticket.original_price ?? undefined,
          currency: ticket.currency,
          quantity: ticket.quantity,
          soldQuantity: ticket.sold_quantity || 0,
          benefits: ticket.benefits || [],
          isActive: ticket.is_active,
          saleStartDate: ticket.sale_start_date ?? undefined,
          saleEndDate: ticket.sale_end_date ?? undefined,
          minPurchaseQuantity: ticket.min_purchase_quantity || 1,
          maxPurchaseQuantity: ticket.max_purchase_quantity || 10,
          requiresVip: ticket.requires_vip || false,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
        })) || [],
      }))

      return { events, error: null }
    } catch (error) {
      return { events: [], error: 'Erro ao buscar eventos' }
    }
  }

  /**
   * Busca um evento específico pelo slug
   */
  static async getEventBySlug(slug: string): Promise<EventResponse> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          ticket_types (*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return { event: null, error: error?.message || 'Evento não encontrado' }
      }

      const event: Event = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        date: data.date,
        time: data.time,
        venue: data.venue,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        location: `${data.venue}, ${data.city} - ${data.state}`,
        bannerUrl: data.banner_url,
        imageUrl: data.banner_url,
        videoUrl: data.video_url || undefined,
        capacity: data.capacity,
        soldTickets: data.sold_tickets || 0,
        status: data.status as EventStatus,
        isActive: data.is_active,
        isFeatured: data.is_featured || false,
        isSpecialEvent: data.is_special_event || false,
        specialEventTheme: data.special_event_theme as SpecialEventTheme,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lineup: (data as any).lineup || [],
        highlights: (data as any).highlights || [],
        policies: (data as any).policies || [],
        ticketTypes: data.ticket_types?.map(ticket => ({
          id: ticket.id,
          eventId: ticket.event_id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          originalPrice: ticket.original_price ?? undefined,
          currency: ticket.currency,
          quantity: ticket.quantity,
          soldQuantity: ticket.sold_quantity || 0,
          benefits: ticket.benefits || [],
          isActive: ticket.is_active,
          minPurchaseQuantity: ticket.min_purchase_quantity,
          maxPurchaseQuantity: ticket.max_purchase_quantity || 10,
          requiresVip: ticket.requires_vip || false,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
        })) || [],
      }

      return { event, error: null }
    } catch (error) {
      return { event: null, error: 'Erro ao buscar evento' }
    }
  }

  /**
   * Busca eventos em destaque
   */
  static async getFeaturedEvents(limit: number = 3): Promise<EventsResponse> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          ticket_types (*)
        `)
        .eq('status', 'upcoming')
        .eq('is_active', true)
        .order('date', { ascending: true })
        .limit(limit)

      if (error) {
        return { events: [], error: error.message }
      }

      const events: Event[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        address: event.address,
        city: event.city,
        state: event.state,
        zipCode: event.zip_code,
        location: `${event.venue}, ${event.city} - ${event.state}`,
        bannerUrl: event.banner_url,
        imageUrl: event.banner_url,
        videoUrl: event.video_url || undefined,
        capacity: event.capacity,
        soldTickets: event.sold_tickets || 0,
        status: event.status as EventStatus,
        isActive: event.is_active,
        isFeatured: event.is_featured || false,
        isSpecialEvent: event.is_special_event || false,
        specialEventTheme: event.special_event_theme as SpecialEventTheme,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        lineup: (event as any).lineup || [],
        highlights: (event as any).highlights || [],
        policies: (event as any).policies || [],
        ticketTypes: event.ticket_types?.map(ticket => ({
          id: ticket.id,
          eventId: ticket.event_id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          originalPrice: ticket.original_price ?? undefined,
          currency: ticket.currency,
          quantity: ticket.quantity,
          soldQuantity: ticket.sold_quantity || 0,
          benefits: ticket.benefits || [],
          isActive: ticket.is_active,
          saleStartDate: ticket.sale_start_date ?? undefined,
          saleEndDate: ticket.sale_end_date ?? undefined,
          minPurchaseQuantity: ticket.min_purchase_quantity || 1,
          maxPurchaseQuantity: ticket.max_purchase_quantity || 10,
          requiresVip: ticket.requires_vip || false,
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at,
        })) || [],
      }))

      return { events, error: null }
    } catch (error) {
      return { events: [], error: 'Erro ao buscar eventos em destaque' }
    }
  }

  /**
   * Atualiza a quantidade de ingressos vendidos de um evento
   */
  static async updateSoldTickets(eventId: string, quantity: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ sold_tickets: quantity })
        .eq('id', eventId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar ingressos vendidos' }
    }
  }
}

export const eventService = EventService
