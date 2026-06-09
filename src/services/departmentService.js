import { supabase } from '../lib/supabase'

const TABLE = 'departments'

export const departmentService = {
  async list() {
    const { data, error } = await supabase.from(TABLE).select('*').order('name')
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from(TABLE).insert(payload).select().single()
    if (error) throw error
    return data
  },
  async update(id, patch) {
    const { data, error } = await supabase.from(TABLE).update(patch).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },
}
