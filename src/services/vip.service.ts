/**
 * Serviço de gerenciamento VIP para usuários premium
 * Integração com Supabase para histórico, cupons e benefícios exclusivos
 */

import { supabase } from '@/lib/supabase';
import { VipList, Coupon, User, Event } from '@/types';
function mapDatabaseUserToInterface(dbUser: any): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    phone: dbUser.phone,
    birth_date: dbUser.birth_date,
    is_vip: dbUser.is_vip,
    vip_since: dbUser.vip_since,
    avatar_url: dbUser.avatar_url,
    created_at: dbUser.created_at,
    updated_at: dbUser.updated_at,
    role: 'customer',
  };
}

function mapDatabaseCouponToInterface(dbCoupon: any): Coupon {
  return {
    id: dbCoupon.id,
    code: dbCoupon.code,
    discount_type: dbCoupon.discount_type,
    discount_value: dbCoupon.discount_value,
    min_order_value: dbCoupon.min_order_value,
    max_discount_value: dbCoupon.max_discount_value,
    valid_from: dbCoupon.valid_from,
    valid_until: dbCoupon.valid_until,
    usage_limit: dbCoupon.usage_limit,
    usage_count: dbCoupon.usage_count || 0,
    is_active: dbCoupon.is_active,
    description: dbCoupon.description,
    is_vip_only: dbCoupon.is_vip_only,
    created_at: dbCoupon.created_at,
    updated_at: dbCoupon.updated_at,
    user_id: dbCoupon.user_id,
  };
}

function mapDatabaseEventToInterface(dbEvent: any): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    date: dbEvent.date,
    time: dbEvent.time,
    venue: dbEvent.venue,
    address: dbEvent.address,
    city: dbEvent.city,
    state: dbEvent.state,
    zipCode: dbEvent.zip_code,
    location: `${dbEvent.venue}, ${dbEvent.city} - ${dbEvent.state}`,
    bannerUrl: dbEvent.banner_url,
    imageUrl: dbEvent.banner_url,
    videoUrl: dbEvent.video_url,
    lineup: dbEvent.lineup || [],
    ticketTypes: (dbEvent.ticket_types || []).map((ticket: any) => ({
      id: ticket.id,
      eventId: ticket.event_id,
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      originalPrice: ticket.original_price,
      currency: ticket.currency,
      quantity: ticket.quantity,
      soldQuantity: ticket.sold_quantity || 0,
      benefits: ticket.benefits || [],
      isActive: ticket.is_active,
      saleStartDate: ticket.sale_start_date,
      saleEndDate: ticket.sale_end_date,
      minPurchaseQuantity: ticket.min_purchase_quantity || 1,
      maxPurchaseQuantity: ticket.max_purchase_quantity || 10,
      requiresVip: ticket.requires_vip || false,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
    })),
    isActive: dbEvent.is_active,
    isFeatured: dbEvent.is_featured || false,
    isSpecialEvent: dbEvent.is_special_event || false,
    specialEventTheme: dbEvent.special_event_theme as any,
    capacity: dbEvent.capacity,
    soldTickets: dbEvent.sold_tickets || 0,
    status: dbEvent.status as any,
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at,
    slug: dbEvent.slug,
    highlights: dbEvent.highlights || [],
    policies: dbEvent.policies || [],
  };
}

export interface VipData {
  user: User;
  vipStatus: VipList | null;
  coupons: Coupon[];
  upcomingEvents: Event[];
  attendedEvents: Event[];
  totalSpent: number;
  vipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface VipResponse {
  data?: VipData;
  error?: string;
}

export interface CouponResponse {
  coupons: Coupon[];
  error?: string;
}

export interface EventHistoryResponse {
  events: Event[];
  error?: string;
}

export class VipService {
  /**
   * Busca dados completos do usuário VIP
   */
  static async getVipData(userId: string): Promise<VipResponse> {
    try {
      // Buscar status VIP do usuário
      const { data: vipStatus, error: vipError } = await supabase
        .from('vip_list')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (vipError && vipError.code !== 'PGRST116') {
        return { error: 'Erro ao verificar status VIP' };
      }

      // Buscar cupons disponíveis
      const { data: coupons, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .or(`user_id.eq.${userId},user_id.is.null`)
        .gte('valid_until', new Date().toISOString());

      if (couponsError) {
        return { error: 'Erro ao buscar cupons' };
      }

      // Buscar eventos futuros para VIPs
      const { data: upcomingEvents, error: upcomingError } = await supabase
        .from('events')
        .select(`
          *,
          ticket_types (*)
        `)
        .eq('status', 'upcoming')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(6);

      if (upcomingError) {
        return { error: 'Erro ao buscar eventos futuros' };
      }

      // Buscar histórico de eventos participados
      const { data: attendedEvents, error: historyError } = await supabase
        .from('orders')
        .select(`
          event_id,
          events (
            *,
            ticket_types (*)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyError) {
        return { error: 'Erro ao buscar histórico' };
      }

      // Calcular gastos totais e nível VIP
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (ordersError) {
        return { error: 'Erro ao calcular gastos' };
      }

      const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const vipLevel = this.calculateVipLevel(totalSpent);

      // Buscar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        return { error: 'Erro ao buscar dados do usuário' };
      }

      const vipData: VipData = {
        user: mapDatabaseUserToInterface(user),
        vipStatus: null,
        coupons: (coupons || []).map(mapDatabaseCouponToInterface),
        upcomingEvents: (upcomingEvents || []).map(mapDatabaseEventToInterface),
        attendedEvents: (attendedEvents?.map(order => order.events) || []).map(mapDatabaseEventToInterface),
        totalSpent,
        vipLevel,
      };

      return { data: vipData };
    } catch (error) {
      return { error: 'Erro ao carregar dados VIP' };
    }
  }

  /**
   * Adiciona usuário à lista VIP
   */
  static async joinVipList(userId: string, phone?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_vip: true,
          vip_since: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { success: false, error: 'Erro ao entrar na lista VIP' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao processar solicitação' };
    }
  }

  /**
   * Resgata cupom
   */
  static async redeemCoupon(couponId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single();

      if (couponError || !coupon) {
        return { success: false, error: 'Cupom não encontrado' };
      }



      if (new Date(coupon.valid_until) < new Date()) {
        return { success: false, error: 'Cupom expirado' };
      }

      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return { success: false, error: 'Cupom esgotado' };
      }

      // Marcar cupom como usado
      const { error: updateError } = await supabase
        .from('coupons')
        .update({
          usage_count: coupon.usage_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', couponId);

      if (updateError) {
        return { success: false, error: 'Erro ao resgatar cupom' };
      }

      // Registrar uso do cupom
      const { error: usageError } = await supabase
        .from('analytics_events')
        .insert({
          event_name: 'coupon_redeemed',
          user_id: userId,
          event_data: { coupon_id: couponId, coupon_code: coupon.code },
          session_id: `session_${Date.now()}`,
          url: window?.location?.href || '/',
        });

      if (usageError) {
        console.error('Erro ao registrar uso do cupom:', usageError);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao resgatar cupom' };
    }
  }

  /**
   * Calcula nível VIP baseado em gastos
   */
  private static calculateVipLevel(totalSpent: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (totalSpent >= 5000) return 'platinum';
    if (totalSpent >= 2000) return 'gold';
    if (totalSpent >= 500) return 'silver';
    return 'bronze';
  }

  /**
   * Verifica se usuário é VIP
   */
  static async isVip(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('vip_list')
        .select('status')
        .eq('user_id', userId)
        .single();

      return !error && data?.status === 'active';
    } catch {
      return false;
    }
  }

  /**
   * Busca benefícios do nível VIP
   */
  static getVipBenefits(level: 'bronze' | 'silver' | 'gold' | 'platinum') {
    const benefits = {
      bronze: {
        name: 'Bronze',
        discount: 5,
        benefits: ['Acesso antecipado', 'Cupons exclusivos', 'Suporte prioritário'],
        color: 'from-amber-600 to-amber-800',
      },
      silver: {
        name: 'Prata',
        discount: 10,
        benefits: ['Acesso antecipado', 'Cupons exclusivos', 'Suporte prioritário', 'Entrada preferencial'],
        color: 'from-gray-400 to-gray-600',
      },
      gold: {
        name: 'Ouro',
        discount: 15,
        benefits: ['Acesso antecipado', 'Cupons exclusivos', 'Suporte VIP', 'Entrada VIP', 'Open bar selecionado'],
        color: 'from-yellow-500 to-yellow-700',
      },
      platinum: {
        name: 'Platina',
        discount: 20,
        benefits: ['Acesso antecipado', 'Cupons exclusivos', 'Suporte VIP', 'Entrada VIP', 'Open bar completo', 'Acesso backstage'],
        color: 'from-purple-500 to-purple-700',
      },
    };

    return benefits[level];
  }
}
