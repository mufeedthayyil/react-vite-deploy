import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Equipment = Database['public']['Tables']['equipments']['Row']
type EquipmentInsert = Database['public']['Tables']['equipments']['Insert']
type EquipmentUpdate = Database['public']['Tables']['equipments']['Update']

export const equipmentService = {
  // Get all equipment
  async getAll(): Promise<Equipment[]> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get equipment by ID
  async getById(id: string): Promise<Equipment | null> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Create new equipment
  async create(equipment: EquipmentInsert): Promise<Equipment> {
    const { data, error } = await supabase
      .from('equipments')
      .insert(equipment)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update equipment
  async update(id: string, equipment: EquipmentUpdate): Promise<Equipment> {
    const { data, error } = await supabase
      .from('equipments')
      .update(equipment)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete equipment
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('equipments')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get equipment by category
  async getByCategory(category: string): Promise<Equipment[]> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get available equipment
  async getAvailable(): Promise<Equipment[]> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}