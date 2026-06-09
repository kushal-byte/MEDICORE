import { supabase } from '../lib/supabase'

export const dashboardService = {
  async stats() {
    const today = new Date().toISOString().slice(0, 10)
    const [p, d, a, todayA, pay] = await Promise.all([
      supabase.from('patients').select('id', { count: 'exact', head: true }),
      supabase.from('doctors').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appt_date', today),
      supabase.from('payments').select('amount').eq('status', 'paid'),
    ])
    const revenue = (pay.data || []).reduce((s, r) => s + Number(r.amount || 0), 0)
    return {
      patients: p.count || 0,
      doctors: d.count || 0,
      appointments: a.count || 0,
      todayAppointments: todayA.count || 0,
      revenue,
    }
  },
  // Monthly patients (last 6 months)
  async monthlyPatients() {
    const { data } = await supabase.from('patients').select('created_at')
    return bucketByMonth(data || [], 'created_at')
  },
  async appointmentTrends() {
    const { data } = await supabase.from('appointments').select('appt_date')
    return bucketByMonth((data || []).map(r => ({ created_at: r.appt_date })), 'created_at')
  },
  async departmentStats() {
    const { data } = await supabase.from('doctors').select('departments(name)')
    const counts = {}
    ;(data || []).forEach(r => {
      const n = r.departments?.name || 'Unassigned'
      counts[n] = (counts[n] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  },
}

function bucketByMonth(rows, key) {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ label: dt.toLocaleString('en', { month: 'short' }), ym: dt.toISOString().slice(0, 7), count: 0 })
  }
  rows.forEach(r => {
    const ym = String(r[key] || '').slice(0, 7)
    const m = months.find(x => x.ym === ym)
    if (m) m.count++
  })
  return months.map(m => ({ name: m.label, value: m.count }))
}
