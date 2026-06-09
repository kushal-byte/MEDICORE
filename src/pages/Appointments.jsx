import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, CalendarDays, CheckCircle2, XCircle } from 'lucide-react'
import { appointmentService } from '../services/appointmentService'
import { doctorService } from '../services/doctorService'
import { patientService } from '../services/patientService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { usePagination } from '../hooks/usePagination'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import SearchBar from '../components/ui/SearchBar'
import Badge from '../components/ui/Badge'
import Pagination from '../components/ui/Pagination'

const STATUSES = ['', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']

export default function Appointments() {
  const { role } = useAuth()
  const toast = useToast()
  const canManage = ['admin', 'receptionist', 'doctor'].includes(role)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [modal, setModal] = useState(false)
  const flat = rows.map(r => ({
    ...r,
    patientName: r.patients?.full_name, doctorName: r.doctors?.full_name,
  }))
  const { rows: page, query, setQuery, page: pg, totalPages, setPage, total } =
    usePagination(flat, { searchKeys: ['patientName', 'doctorName', 'reason'] })

  async function load() {
    setLoading(true)
    try { setRows(await appointmentService.list({ status: filter || null })) }
    catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [filter])

  async function setStatus(id, status) {
    try { await appointmentService.setStatus(id, status); toast.success(`Marked ${status}`); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Search appointments…" />
          <select className="input w-40" value={filter} onChange={e => setFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s} className="bg-navy-800">{s ? s.replace('_', ' ') : 'All status'}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Book appointment</button>
      </div>

      {loading ? <Spinner /> : page.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No appointments" hint="Book a new appointment to begin." />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3 hidden md:table-cell">Date / Time</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  {canManage && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {page.map(a => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/[.03]">
                    <td className="px-4 py-3 font-semibold text-slate-100">{a.patientName || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{a.doctorName || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-400">{a.appt_date} · {String(a.appt_time).slice(0,5)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400 max-w-[200px] truncate">{a.reason || '—'}</td>
                    <td className="px-4 py-3"><Badge status={a.status} /></td>
                    {canManage && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button className="btn-ghost px-2 py-1.5 mr-1" title="Confirm" onClick={() => setStatus(a.id, 'confirmed')}><CheckCircle2 size={14} /></button>
                        <button className="btn-danger px-2 py-1.5" title="Cancel" onClick={() => setStatus(a.id, 'cancelled')}><XCircle size={14} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4"><Pagination page={pg} totalPages={totalPages} onChange={setPage} total={total} /></div>
        </Card>
      )}

      {modal && <BookForm onClose={() => setModal(false)} onSaved={() => { setModal(false); load() }} />}
    </div>
  )
}

function BookForm({ onClose, onSaved }) {
  const toast = useToast()
  const { register, handleSubmit } = useForm()
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const [d, p] = await Promise.all([doctorService.list(), patientService.list().catch(() => [])])
        setDoctors(d); setPatients(p)
      } catch (e) { toast.error(e.message) }
    })()
  }, [])

  async function onSubmit(v) {
    setBusy(true)
    const doc = doctors.find(d => d.id === v.doctor_id)
    const payload = {
      patient_id: v.patient_id, doctor_id: v.doctor_id,
      department_id: doc?.department_id || null,
      appt_date: v.appt_date, appt_time: v.appt_time,
      reason: v.reason, status: 'scheduled',
    }
    try { await appointmentService.create(payload); toast.success('Appointment booked'); onSaved() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <Modal open onClose={onClose} title="Book appointment" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-3">
        <In label="Patient">
          <select className="input" {...register('patient_id', { required: true })}>
            <option value="" className="bg-navy-800">Select patient</option>
            {patients.map(p => <option key={p.id} value={p.id} className="bg-navy-800">{p.full_name}</option>)}
          </select>
        </In>
        <In label="Doctor">
          <select className="input" {...register('doctor_id', { required: true })}>
            <option value="" className="bg-navy-800">Select doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id} className="bg-navy-800">{d.full_name} · {d.specialization}</option>)}
          </select>
        </In>
        <In label="Date"><input className="input" type="date" {...register('appt_date', { required: true })} /></In>
        <In label="Time"><input className="input" type="time" {...register('appt_time', { required: true })} /></In>
        <In label="Reason" full><input className="input" placeholder="Reason for visit" {...register('reason')} /></In>
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Booking…' : 'Book'}</button>
        </div>
      </form>
    </Modal>
  )
}
function In({ label, full, children }) {
  return <div className={full ? 'sm:col-span-2' : ''}><label className="label">{label}</label>{children}</div>
}
