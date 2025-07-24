export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      equipments: {
        Row: {
          id: string
          name: string
          image_url: string
          description: string
          rate_12hr: number
          rate_24hr: number
          available: boolean | null
          category: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          description: string
          rate_12hr?: number
          rate_24hr?: number
          available?: boolean | null
          category: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          description?: string
          rate_12hr?: number
          rate_24hr?: number
          available?: boolean | null
          category?: string
          created_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          equipment_id: string | null
          duration: string
          rent_date: string
          return_date: string
          total_cost: number
          handled_by: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          equipment_id?: string | null
          duration: string
          rent_date: string
          return_date: string
          total_cost?: number
          handled_by?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          equipment_id?: string | null
          duration?: string
          rent_date?: string
          return_date?: string
          total_cost?: number
          handled_by?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      suggestions: {
        Row: {
          id: string
          suggestion_text: string
          suggested_by: string
          created_at: string | null
        }
        Insert: {
          id?: string
          suggestion_text: string
          suggested_by: string
          created_at?: string | null
        }
        Update: {
          id?: string
          suggestion_text?: string
          suggested_by?: string
          created_at?: string | null
        }
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