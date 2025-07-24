import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

export const orderService = {
  // Get all orders (admin/staff only)
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        equipments (
          name,
          image_url
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get user's orders
  async getUserOrders(userEmail: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        equipments (
          name,
          image_url
        )
      `)
      .eq('customer_email', userEmail)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new order
  async create(order: OrderInsert): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update order
  async update(id: string, order: OrderUpdate): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete order
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get orders by status
  async getByStatus(status: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        equipments (
          name,
          image_url
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}