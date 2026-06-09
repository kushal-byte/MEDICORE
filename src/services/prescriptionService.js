import { supabase } from '../lib/supabase'

const TABLE = 'prescriptions'
const SELECT = '*, patients(full_name), doctors(full_name, specialization)'

export const prescriptionService = {
  async list({ patientId = null, doctorId = null } = {}) {
    let q = supabase.from(TABLE).select(SELECT).order('issued_at', { ascending: false })
    if (patientId) q = q.eq('patient_id', patientId)
    if (doctorId)  q = q.eq('doctor_id', doctorId)
    const { data, error } = await q
    if (error) throw error
    return data
  },
  async get(id) {
    const { data, error } = await supabase.from(TABLE).select(SELECT).eq('id', id).single()
    if (error) throw error
    return data
  },
  async create(payload) {
    const { data, error } = await supabase.from(TABLE).insert(payload).select(SELECT).single()
    if (error) throw error
    return data
  },
  async update(id, patch) {
    const { data, error } = await supabase.from(TABLE).update(patch).eq('id', id).select(SELECT).single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },
}
