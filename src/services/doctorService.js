import { supabase } from '../lib/supabase'

const TABLE = 'doctors'

export const doctorService = {
  async list({ search = '', departmentId = null } = {}) {
    let q = supabase.from(TABLE)
      .select('*, departments(name)')
      .order('full_name', { ascending: true })
    if (departmentId) q = q.eq('department_id', departmentId)
    if (search) q = q.ilike('full_name', `%${search}%`)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async get(id) {
    const { data, error } = await supabase.from(TABLE)
      .select('*, departments(name)').eq('id', id).single()
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
