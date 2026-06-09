import { supabase } from '../lib/supabase'

const TABLE = 'patients'

export const patientService = {
  async list({ search = '' } = {}) {
    let q = supabase.from(TABLE).select('*').order('created_at', { ascending: false })
    if (search) q = q.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async get(id) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
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
