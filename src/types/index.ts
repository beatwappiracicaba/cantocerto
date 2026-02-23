// User Types
export type UserRole = 'customer' | 'manager'

export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  birth_date?: string | null
  is_vip: boolean
  vip_since?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
  role: UserRole
}

export interface UserProfile extends User {
  vipBenefits: VipBenefit[]
  coupons: Coupon[]
  orderHistory: Order[]
  isVip: boolean
  vipSince?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  address: string
  city: string
  state: string
  zipCode: string
  location?: string // Computed location string for display
  bannerUrl: string
  imageUrl?: string // Alias for bannerUrl for compatibility
  videoUrl?: string
  lineup: Artist[]
  ticketTypes: TicketType[]
  isActive: boolean
  isFeatured: boolean
  isSpecialEvent: boolean
  specialEventTheme?: SpecialEventTheme
  capacity: number
  soldTickets: number
  status: EventStatus
  createdAt: string
  updatedAt: string
  slug: string
  highlights?: string[]
  policies?: string[]
}

export interface Artist {
  id: string
  name: string
  imageUrl?: string
  bio?: string
  genre?: string
  socialLinks?: SocialLinks
}

export interface SocialLinks {
  instagram?: string
  spotify?: string
  youtube?: string
  website?: string
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type SpecialEventTheme = 'neon' | 'gold' | 'diamond' | 'halloween' | 'new-year' | 'carnival'

// Ticket Types
export interface TicketType {
  id: string
  eventId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  quantity: number
  soldQuantity: number
  benefits: string[]
  isActive: boolean
  saleStartDate?: string
  saleEndDate?: string
  minPurchaseQuantity: number
  maxPurchaseQuantity: number
  requiresVip: boolean
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: string
  eventId: string
  ticketTypeId: string
  orderId: string
  userId: string
  qrCode: string
  status: TicketStatus
  checkInAt?: string
  checkInBy?: string
  createdAt: string
  updatedAt: string
}

export type TicketStatus = 'active' | 'used' | 'cancelled' | 'expired'

// Order Types
export interface Order {
  id: string
  user_id: string
  event_id: string
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  status: OrderStatus
  payment_method: string
  payment_status: PaymentStatus
  payment_id?: string
  coupon_code?: string
  notes?: string
  created_at: string
  updated_at: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_cpf?: string
  total_amount?: number
  discount_amount?: number
  final_amount?: number
}

export interface OrderItem {
  id: string
  order_id: string
  ticket_type_id: string
  quantity: number
  unit_price: number
  total_price: number
  is_used?: boolean
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'stripe'

// Coupon Types
export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value?: number
  max_discount_value?: number
  valid_from: string
  valid_until: string
  usage_limit?: number
  usage_count: number
  is_active: boolean
  description: string
  is_vip_only: boolean
  created_at: string
  updated_at: string
  user_id?: string
}

// VIP Types
export interface VipBenefit {
  id: string
  title: string
  description: string
  icon: string
  isActive: boolean
  createdAt: string
}

export interface VipListEntry {
  id: string
  userId: string
  eventId: string
  addedAt: string
  status: 'active' | 'removed'
}

export interface VipList {
  id: string
  userId: string
  vipLevel: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Gallery Types
export interface GalleryImage {
  id: string
  url: string
  title?: string
  description?: string
  eventId?: string
  isFeatured: boolean
  order: number
  createdAt: string
}

// Video Types
export interface HomeVideo {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl: string
  isActive: boolean
  startDate?: string
  endDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

// Testimonial Types
export interface Testimonial {
  id: string
  name: string
  role?: string
  avatarUrl?: string
  content: string
  rating: number
  isActive: boolean
  createdAt: string
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  eventName: string
  eventData: Record<string, any>
  userId?: string
  sessionId: string
  timestamp: string
  url: string
  userAgent?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface VipSignupForm {
  name: string
  email: string
  phone: string
  birthDate: string
  preferences: string[]
}

// Payment Types
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
  metadata?: Record<string, string>
}

// QR Code Types
export interface QRCodeData {
  ticketId: string
  eventId: string
  userId: string
  timestamp: string
  signature: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Loading States
export interface LoadingState {
  isLoading: boolean
  error: string | null
  progress?: number
}

// Search and Filter Types
export interface EventFilters {
  dateFrom?: string
  dateTo?: string
  genre?: string[]
  priceRange?: {
    min: number
    max: number
  }
  city?: string
  isVipOnly?: boolean
}

export interface SearchQuery {
  query: string
  filters: EventFilters
  sortBy: 'date' | 'price' | 'popularity'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}
