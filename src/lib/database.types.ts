export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          birth_date: string | null
          is_vip: boolean
          vip_since: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          birth_date?: string | null
          is_vip?: boolean
          vip_since?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          birth_date?: string | null
          is_vip?: boolean
          vip_since?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          venue: string
          address: string
          city: string
          state: string
          zip_code: string
          banner_url: string
          video_url: string | null
          is_active: boolean
          is_featured: boolean
          is_special_event: boolean
          special_event_theme: string | null
          capacity: number
          sold_tickets: number
          status: string
          created_at: string
          updated_at: string
          slug: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          venue: string
          address: string
          city: string
          state: string
          zip_code: string
          banner_url: string
          video_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_special_event?: boolean
          special_event_theme?: string | null
          capacity: number
          sold_tickets?: number
          status?: string
          created_at?: string
          updated_at?: string
          slug: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          venue?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          banner_url?: string
          video_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_special_event?: boolean
          special_event_theme?: string | null
          capacity?: number
          sold_tickets?: number
          status?: string
          created_at?: string
          updated_at?: string
          slug?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          id: string
          name: string
          image_url: string | null
          bio: string | null
          genre: string | null
          instagram: string | null
          spotify: string | null
          youtube: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          bio?: string | null
          genre?: string | null
          instagram?: string | null
          spotify?: string | null
          youtube?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          bio?: string | null
          genre?: string | null
          instagram?: string | null
          spotify?: string | null
          youtube?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_artists: {
        Row: {
          id: string
          event_id: string
          artist_id: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          artist_id: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          artist_id?: string
          order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_artists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket_types: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string
          price: number
          original_price: number | null
          currency: string
          quantity: number
          sold_quantity: number
          benefits: string[]
          is_active: boolean
          sale_start_date: string | null
          sale_end_date: string | null
          min_purchase_quantity: number
          max_purchase_quantity: number
          requires_vip: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description: string
          price: number
          original_price?: number | null
          currency?: string
          quantity: number
          sold_quantity?: number
          benefits?: string[]
          is_active?: boolean
          sale_start_date?: string | null
          sale_end_date?: string | null
          min_purchase_quantity?: number
          max_purchase_quantity?: number
          requires_vip?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          currency?: string
          quantity?: number
          sold_quantity?: number
          benefits?: string[]
          is_active?: boolean
          sale_start_date?: string | null
          sale_end_date?: string | null
          min_purchase_quantity?: number
          max_purchase_quantity?: number
          requires_vip?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          ticket_type_id: string
          order_id: string
          user_id: string
          qr_code: string
          status: string
          check_in_at: string | null
          check_in_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          ticket_type_id: string
          order_id: string
          user_id: string
          qr_code: string
          status?: string
          check_in_at?: string | null
          check_in_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          ticket_type_id?: string
          order_id?: string
          user_id?: string
          qr_code?: string
          status?: string
          check_in_at?: string | null
          check_in_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          event_id: string
          subtotal: number
          discount: number
          tax: number
          total: number
          currency: string
          status: string
          payment_method: string
          payment_status: string
          payment_id: string | null
          coupon_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          subtotal: number
          discount: number
          tax: number
          total: number
          currency?: string
          status?: string
          payment_method: string
          payment_status?: string
          payment_id?: string | null
          coupon_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          subtotal?: number
          discount?: number
          tax?: number
          total?: number
          currency?: string
          status?: string
          payment_method?: string
          payment_status?: string
          payment_id?: string | null
          coupon_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          ticket_type_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ticket_type_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ticket_type_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: string
          discount_value: number
          min_order_value: number | null
          max_discount_value: number | null
          valid_from: string
          valid_until: string
          usage_limit: number | null
          usage_count: number
          is_active: boolean
          description: string
          is_vip_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: string
          discount_value: number
          min_order_value?: number | null
          max_discount_value?: number | null
          valid_from: string
          valid_until: string
          usage_limit?: number | null
          usage_count?: number
          is_active?: boolean
          description: string
          is_vip_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          min_order_value?: number | null
          max_discount_value?: number | null
          valid_from?: string
          valid_until?: string
          usage_limit?: number | null
          usage_count?: number
          is_active?: boolean
          description?: string
          is_vip_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vip_list: {
        Row: {
          id: string
          user_id: string
          event_id: string
          added_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          added_at?: string
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          added_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_list_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vip_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      gallery: {
        Row: {
          id: string
          url: string
          title: string | null
          description: string | null
          event_id: string | null
          is_featured: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          title?: string | null
          description?: string | null
          event_id?: string | null
          is_featured?: boolean
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          title?: string | null
          description?: string | null
          event_id?: string | null
          is_featured?: boolean
          order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      videos_home: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string
          is_active: boolean
          start_date: string | null
          end_date: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url: string
          is_active?: boolean
          start_date?: string | null
          end_date?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string
          is_active?: boolean
          start_date?: string | null
          end_date?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          avatar_url: string | null
          content: string
          rating: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          avatar_url?: string | null
          content: string
          rating: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          avatar_url?: string | null
          content?: string
          rating?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          event_data: Json
          user_id: string | null
          session_id: string
          timestamp: string
          url: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          event_name: string
          event_data: Json
          user_id?: string | null
          session_id: string
          timestamp?: string
          url: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          event_name?: string
          event_data?: Json
          user_id?: string | null
          session_id?: string
          timestamp?: string
          url?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}