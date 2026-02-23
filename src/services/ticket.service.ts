/**
 * Serviço de gerenciamento de ingressos e pagamentos
 * Integração com Supabase para controle de estoque e pedidos
 * Preparado para integração com Stripe/Mercado Pago
 */

import { supabase } from '@/lib/supabase';
import { TicketType, Order, OrderItem, User } from '@/types';
import { generateQRCodeData, generateSecureRandomString } from '@/utils';
function mapDatabaseOrderToInterface(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    user_id: dbOrder.user_id,
    event_id: dbOrder.event_id,
    items: [],
    subtotal: dbOrder.subtotal || 0,
    discount: dbOrder.discount || 0,
    tax: dbOrder.tax || 0,
    total: dbOrder.total || dbOrder.final_amount || dbOrder.total_amount || 0,
    currency: dbOrder.currency || 'BRL',
    status: dbOrder.status as any,
    payment_method: dbOrder.payment_method,
    payment_status: dbOrder.payment_status as any,
    payment_id: dbOrder.payment_id,
    coupon_code: dbOrder.coupon_code,
    notes: dbOrder.notes,
    created_at: dbOrder.created_at,
    updated_at: dbOrder.updated_at,
  };
}

function mapDatabaseOrderItemToInterface(dbItem: any): OrderItem {
  return {
    id: dbItem.id,
    order_id: dbItem.order_id,
    ticket_type_id: dbItem.ticket_type_id,
    quantity: dbItem.quantity,
    unit_price: dbItem.unit_price,
    total_price: dbItem.total_price,
    is_used: dbItem.is_used || false,
  };
}

export interface PurchaseData {
  eventId: string;
  ticketTypes: Array<{
    ticketTypeId: string;
    quantity: number;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  useVipDiscount?: boolean;
  couponCode?: string;
}

export interface PurchaseResponse {
  success: boolean;
  order?: Order;
  paymentUrl?: string;
  qrCode?: string;
  error?: string;
}

export interface TicketAvailabilityResponse {
  available: boolean;
  remaining: number;
  error?: string;
}

export interface ValidateTicketResponse {
  valid: boolean;
  used: boolean;
  eventTitle?: string;
  customerName?: string;
  error?: string;
}

export class TicketService {
  /**
   * Verifica disponibilidade de ingressos
   */
  static async checkAvailability(ticketTypeId: string, requestedQuantity: number): Promise<TicketAvailabilityResponse> {
    try {
      const { data: ticketType, error } = await supabase
        .from('ticket_types')
        .select('quantity, sold_quantity')
        .eq('id', ticketTypeId)
        .single();

      if (error || !ticketType) {
        return { available: false, remaining: 0, error: 'Tipo de ingresso não encontrado' };
      }

      const remaining = ticketType.quantity - ticketType.sold_quantity;
      const available = remaining >= requestedQuantity;

      return { available, remaining };
    } catch (error) {
      return { available: false, remaining: 0, error: 'Erro ao verificar disponibilidade' };
    }
  }

  /**
   * Processa compra de ingressos
   */
  static async purchaseTickets(purchaseData: PurchaseData, userId?: string): Promise<PurchaseResponse> {
    try {
      // Verificar se userId é válido
      if (!userId) {
        return { success: false, error: 'Usuário não autenticado' };
      }
      // Validar disponibilidade de todos os tipos de ingresso
      for (const item of purchaseData.ticketTypes) {
        const availability = await this.checkAvailability(item.ticketTypeId, item.quantity);
        if (!availability.available) {
          return { 
            success: false, 
            error: `Ingressos esgotados para um dos tipos selecionados. Restam apenas ${availability.remaining} ingressos.` 
          };
        }
      }

      // Calcular total e aplicar descontos
      const { totalAmount, discountAmount, finalAmount } = await this.calculateTotal(
        purchaseData.ticketTypes,
        purchaseData.useVipDiscount,
        purchaseData.couponCode,
        userId
      );

      // Criar pedido
      const orderData = {
        user_id: userId,
        event_id: purchaseData.eventId,
        customer_name: purchaseData.customerInfo.name,
        customer_email: purchaseData.customerInfo.email,
        customer_phone: purchaseData.customerInfo.phone,
        customer_cpf: purchaseData.customerInfo.cpf,
        subtotal: totalAmount + discountAmount, // Subtotal before discount
        discount: discountAmount,
        tax: 0, // No tax for now
        total: finalAmount,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        payment_method: purchaseData.paymentMethod,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError || !order) {
        return { success: false, error: 'Erro ao criar pedido' };
      }

      // Transformar o pedido do banco para a interface
      const mappedOrder = mapDatabaseOrderToInterface(order);

      // Criar itens do pedido
      const orderItems = await Promise.all(
        purchaseData.ticketTypes.map(async (item) => {
          const { data: ticketType } = await supabase
            .from('ticket_types')
            .select('name, price')
            .eq('id', item.ticketTypeId)
            .single();

          const qrCodeData = generateQRCodeData(order.id, item.ticketTypeId, userId);

          return {
            order_id: order.id,
            ticket_type_id: item.ticketTypeId,
            quantity: item.quantity,
            unit_price: ticketType?.price || 0,
            total_price: (ticketType?.price || 0) * item.quantity,
            qr_code: qrCodeData,
            created_at: new Date().toISOString(),
          };
        })
      );

      const { data: createdItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError || !createdItems) {
        // Rollback do pedido se houver erro nos itens
        await supabase.from('orders').delete().eq('id', order.id);
        return { success: false, error: 'Erro ao criar itens do pedido' };
      }

      // Atualizar o pedido com os itens
      mappedOrder.items = createdItems.map(mapDatabaseOrderItemToInterface);

      // Atualizar quantidade vendida dos ingressos
      await Promise.all(
        purchaseData.ticketTypes.map(async (item) => {
          const { data: currentTicketType } = await supabase
            .from('ticket_types')
            .select('sold_quantity')
            .eq('id', item.ticketTypeId)
            .single();

          if (currentTicketType) {
            const { error } = await supabase
              .from('ticket_types')
              .update({
                sold_quantity: currentTicketType.sold_quantity + item.quantity,
                updated_at: new Date().toISOString(),
              })
              .eq('id', item.ticketTypeId);

            if (error) {
              console.error('Erro ao atualizar quantidade vendida:', error);
            }
          }
        })
      )

      // Processar pagamento (mock - preparado para integração real)
      const paymentResult = await this.processPayment(mappedOrder, purchaseData.paymentMethod);

      await supabase.from('analytics_events').insert({
        event_name: 'ticket_purchase_initiated',
        user_id: userId,
        session_id: generateSecureRandomString(16),
        timestamp: new Date().toISOString(),
        url: '/tickets/purchase',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        event_data: {
          order_id: order.id,
          event_id: purchaseData.eventId,
          total_amount: finalAmount,
          payment_method: purchaseData.paymentMethod,
          ticket_types: purchaseData.ticketTypes,
        },
      });

      return {
        success: true,
        order: mappedOrder,
        paymentUrl: paymentResult.paymentUrl,
        qrCode: paymentResult.qrCode,
      };
    } catch (error) {
      console.error('Erro na compra de ingressos:', error);
      return { success: false, error: 'Erro ao processar compra' };
    }
  }

  /**
   * Calcula total com descontos
   */
  private static async calculateTotal(
    ticketTypes: Array<{ ticketTypeId: string; quantity: number }>,
    useVipDiscount?: boolean,
    couponCode?: string,
    userId?: string
  ): Promise<{ totalAmount: number; discountAmount: number; finalAmount: number }> {
    let totalAmount = 0;

    // Calcular valor base
    for (const item of ticketTypes) {
      const { data: ticketType } = await supabase
        .from('ticket_types')
        .select('price')
        .eq('id', item.ticketTypeId)
        .single();

      if (ticketType) {
        totalAmount += ticketType.price * item.quantity;
      }
    }

    let discountAmount = 0;

    // Aplicar desconto VIP
    if (useVipDiscount && userId) {
      const { data: userVip } = await supabase
        .from('users')
        .select('is_vip')
        .eq('id', userId)
        .single();

      if (userVip?.is_vip) {
        const discountRate = 0.10;
        discountAmount += totalAmount * discountRate;
      }
    }

    // Aplicar cupom
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('discount_type, discount_value')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discountAmount += totalAmount * (coupon.discount_value / 100);
        } else {
          discountAmount += coupon.discount_value;
        }
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    return { totalAmount, discountAmount, finalAmount };
  }

  /**
   * Processa pagamento (mock - preparado para integração real)
   */
  private static async processPayment(order: Order, paymentMethod: string): Promise<{ paymentUrl?: string; qrCode?: string }> {
    // Mock de processamento de pagamento
    // Aqui será integrado com Stripe ou Mercado Pago
    
    switch (paymentMethod) {
      case 'pix':
        return {
          qrCode: `00020126580014BR.GOV.BCB.PIX0136${order.id}5204000053039865404${order.total}5802BR5925Canto Certo - Casa de Shows6009Piracicaba62070503***6304${Date.now()}`,
        };
      
      case 'credit_card':
        return {
          paymentUrl: `/payment/credit-card/${order.id}`,
        };
      
      case 'boleto':
        return {
          paymentUrl: `/payment/boleto/${order.id}`,
        };
      
      default:
        return {};
    }
  }

  /**
   * Valida ingresso via QR Code
   */
  static async validateTicket(qrCodeData: string): Promise<ValidateTicketResponse> {
    try {
      const { data: orderItem, error } = await supabase
        .from('order_items')
        .select(`
          *,
          orders!inner(
            *,
            events!inner(title)
          )
        `)
        .eq('qr_code', qrCodeData)
        .single();

      if (error || !orderItem) {
        return { valid: false, used: false, error: 'Ingresso não encontrado' };
      }

      if (orderItem.orders.status !== 'completed') {
        return { valid: false, used: false, error: 'Pagamento não confirmado' };
      }

      // Aqui poderíamos marcar o ingresso como usado na tabela apropriada (tickets),
      // mas como o schema atual não possui essa coluna em order_items, omitimos a atualização.

      // Registrar validação
      await supabase.from('analytics_events').insert({
        event_name: 'ticket_validated',
        user_id: orderItem.orders.user_id,
        session_id: generateSecureRandomString(16),
        timestamp: new Date().toISOString(),
        url: '/tickets/validate',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        event_data: {
          order_id: orderItem.order_id,
          ticket_type_id: orderItem.ticket_type_id,
          event_id: orderItem.orders.event_id,
        },
      });

      return {
        valid: true,
        used: false,
        eventTitle: orderItem.orders.events.title,
      };
    } catch (error) {
      return { valid: false, used: false, error: 'Erro ao validar ingresso' };
    }
  }

  /**
   * Busca pedidos do usuário
   */
  static async getUserOrders(userId: string): Promise<{ orders: Order[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events(title, date, location),
          order_items(
            *,
            ticket_types(name, price)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { orders: [], error: 'Erro ao buscar pedidos' };
      }

      // Transformar dados do banco para as interfaces
      const orders: Order[] = (data || []).map((dbOrder: any) => {
        const order = mapDatabaseOrderToInterface(dbOrder);
        if (dbOrder.order_items) {
          order.items = dbOrder.order_items.map((item: any) => ({
            id: item.id,
            orderId: item.order_id,
            ticketTypeId: item.ticket_type_id,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.total_price,
            isUsed: item.is_used || false,
          }));
        }
        return order;
      });

      return { orders };
    } catch (error) {
      return { orders: [], error: 'Erro ao buscar pedidos' };
    }
  }

  /**
   * Busca detalhes de um pedido específico
   */
  static async getOrderDetails(orderId: string, userId: string): Promise<{ order?: Order; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events(*),
          order_items(
            *,
            ticket_types(*)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return { error: 'Pedido não encontrado' };
      }

      // Transformar dados do banco para a interface
      const order = mapDatabaseOrderToInterface(data);
      if (data.order_items) {
        order.items = data.order_items.map(mapDatabaseOrderItemToInterface);
      }

      return { order };
    } catch (error) {
      return { error: 'Erro ao buscar detalhes do pedido' };
    }
  }
}
