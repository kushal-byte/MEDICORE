import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react'
import { doctorService } from '../services/doctorService'
import { departmentService } from '../services/departmentService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { usePagination } from '../hooks/usePagination'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'

export default function Doctors() {
  const { role } = useAuth()
  const toast = useToast()
  const canEdit = role === 'admin'
  const [rows, setRows] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // {} or doctor
  const { rows: page, query, setQuery, page: pg, totalPages, setPage, total } =
    usePagination(rows, { searchKeys: ['full_name', 'specialization', 'email'] })

  async function load() {
    setLoading(true)
    try {
      const [d, dp] = await Promise.all([doctorService.list(), departmentService.list().catch(() => [])])
      setRows(d); setDepts(dp)
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function del(id) {
    if (!confirm('Delete this doctor?')) return
    try { await doctorService.remove(id); toast.success('Doctor deleted'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search doctors…" />
        {canEdit && <button className="btn-primary" onClick={() => setModal({})}><Plus size={16} /> Add doctor</button>}
      </div>

      {loading ? <Spinner /> : page.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No doctors found" hint="Add your first doctor to get started." />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3 hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Fee</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Exp</th>
                  {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {page.map(d => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/[.03]">
                    <td className="px-4 py-3 font-semibold text-slate-100">{d.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{d.specialization}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-400">{d.departments?.name || '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400">₹{d.consultation_fee}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400">{d.experience_yrs}y</td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button className="btn-ghost px-2 py-1.5 mr-1" onClick={() => setModal(d)}><Pencil size={14} /></button>
                        <button className="btn-danger px-2 py-1.5" onClick={() => del(d.id)}><Trash2 size={14} /></button>
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

      {modal && (
        <DoctorForm doctor={modal.id ? modal : null} depts={depts}
          onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}

function DoctorForm({ doctor, depts, onClose, onSaved }) {
  const toast = useToast()
  const { register, handleSubmit } = useForm({ defaultValues: doctor || { available: true } })
  const [busy, setBusy] = useState(false)
  async function onSubmit(v) {
    setBusy(true)
    const payload = {
      full_name: v.full_name, email: v.email, phone: v.phone,
      specialization: v.specialization, department_id: v.department_id || null,
      qualification: v.qualification, experience_yrs: Number(v.experience_yrs) || 0,
      consultation_fee: Number(v.consultation_fee) || 0, available: true,
    }
    try {
      if (doctor) await doctorService.update(doctor.id, payload)
      else await doctorService.create(payload)
      toast.success(doctor ? 'Doctor updated' : 'Doctor added'); onSaved()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <Modal open onClose={onClose} title={doctor ? 'Edit doctor' : 'Add doctor'} wide>
      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-3">
        <In label="Full name"><input className="input" {...register('full_name', { required: true })} /></In>
        <In label="Specialization"><input className="input" {...register('specialization', { required: true })} /></In>
        <In label="Email"><input className="input" type="email" {...register('email')} /></In>
        <In label="Phone"><input className="input" {...register('phone')} /></In>
        <In label="Department">
          <select className="input" {...register('department_id')}>
            <option value="" className="bg-navy-800">—</option>
            {depts.map(d => <option key={d.id} value={d.id} className="bg-navy-800">{d.name}</option>)}
          </select>
        </In>
        <In label="Qualification"><input className="input" {...register('qualification')} /></In>
        <In label="Experience (yrs)"><input className="input" type="number" {...register('experience_yrs')} /></In>
        <In label="Consultation fee"><input className="input" type="number" {...register('consultation_fee')} /></In>
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  )
}
function In({ label, children }) {
  return <div><label className="label">{label}</label>{children}</div>
}
