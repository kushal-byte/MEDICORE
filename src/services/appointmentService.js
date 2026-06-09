import { supabase } from '../lib/supabase'

const TABLE = 'appointments'
const SELECT = '*, patients(full_name), doctors(full_name, specialization), departments(name)'

export const appointmentService = {
  async list({ search = '', status = null, doctorId = null, patientId = null } = {}) {
    let q = supabase.from(TABLE).select(SELECT)
      .order('appt_date', { ascending: false })
      .order('appt_time', { ascending: true })
    if (status)    q = q.eq('status', status)
    if (doctorId)  q = q.eq('doctor_id', doctorId)
    if (patientId) q = q.eq('patient_id', patientId)
    const { data, error } = await q
    if (error) throw error
    let rows = data || []
    if (search) {
      const s = search.toLowerCase()
      rows = rows.filter(r =>
        r.patients?.full_name?.toLowerCase().includes(s) ||
        r.doctors?.full_name?.toLowerCase().includes(s) ||
        r.reason?.toLowerCase().includes(s))
    }
    return rows
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
  async setStatus(id, status) { return this.update(id, { status }) },
  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return true
  },
}
