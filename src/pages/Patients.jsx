import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Download, Users } from 'lucide-react'
import { patientService } from '../services/patientService'
import { useToast } from '../hooks/useToast'
import { usePagination } from '../hooks/usePagination'
import { exportToCsv } from '../utils/exportCsv'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'

export default function Patients() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const { rows: page, query, setQuery, page: pg, totalPages, setPage, total } =
    usePagination(rows, { searchKeys: ['full_name', 'phone', 'email', 'blood_group'] })

  async function load() {
    setLoading(true)
    try { setRows(await patientService.list()) }
    catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function del(id) {
    if (!confirm('Delete this patient?')) return
    try { await patientService.remove(id); toast.success('Patient deleted'); load() }
    catch (e) { toast.error(e.message) }
  }

  function exportCsv() {
    exportToCsv('patients', rows, [
      { key: 'full_name', label: 'Name' }, { key: 'gender', label: 'Gender' },
      { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' },
      { key: 'blood_group', label: 'Blood' }, { key: 'address', label: 'Address' },
    ])
    toast.success('Exported CSV')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search patients…" />
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={exportCsv}><Download size={16} /> Export</button>
          <button className="btn-primary" onClick={() => setModal({})}><Plus size={16} /> Add patient</button>
        </div>
      </div>

      {loading ? <Spinner /> : page.length === 0 ? (
        <EmptyState icon={Users} title="No patients found" hint="Register your first patient." />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Gender</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3 hidden md:table-cell">Blood</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Address</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {page.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[.03]">
                    <td className="px-4 py-3 font-semibold text-slate-100">{p.full_name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-400 capitalize">{p.gender || '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{p.phone || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-400">{p.blood_group || '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400 max-w-[200px] truncate">{p.address || '—'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button className="btn-ghost px-2 py-1.5 mr-1" onClick={() => setModal(p)}><Pencil size={14} /></button>
                      <button className="btn-danger px-2 py-1.5" onClick={() => del(p.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4"><Pagination page={pg} totalPages={totalPages} onChange={setPage} total={total} /></div>
        </Card>
      )}

      {modal && <PatientForm patient={modal.id ? modal : null}
        onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </div>
  )
}

function PatientForm({ patient, onClose, onSaved }) {
  const toast = useToast()
  const { register, handleSubmit } = useForm({ defaultValues: patient || {} })
  const [busy, setBusy] = useState(false)
  async function onSubmit(v) {
    setBusy(true)
    const payload = {
      full_name: v.full_name, email: v.email, phone: v.phone, gender: v.gender,
      dob: v.dob || null, blood_group: v.blood_group, address: v.address,
      emergency_contact: v.emergency_contact,
    }
    try {
      if (patient) await patientService.update(patient.id, payload)
      else await patientService.create(payload)
      toast.success(patient ? 'Patient updated' : 'Patient added'); onSaved()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <Modal open onClose={onClose} title={patient ? 'Edit patient' : 'Add patient'} wide>
      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-3">
        <In label="Full name"><input className="input" {...register('full_name', { required: true })} /></In>
        <In label="Phone"><input className="input" {...register('phone')} /></In>
        <In label="Email"><input className="input" type="email" {...register('email')} /></In>
        <In label="Gender">
          <select className="input" {...register('gender')}>
            <option value="" className="bg-navy-800">—</option>
            <option value="male" className="bg-navy-800">Male</option>
            <option value="female" className="bg-navy-800">Female</option>
            <option value="other" className="bg-navy-800">Other</option>
          </select>
        </In>
        <In label="Date of birth"><input className="input" type="date" {...register('dob')} /></In>
        <In label="Blood group"><input className="input" placeholder="O+" {...register('blood_group')} /></In>
        <In label="Emergency contact"><input className="input" {...register('emergency_contact')} /></In>
        <In label="Address"><input className="input" {...register('address')} /></In>
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  )
}
function In({ label, children }) { return <div><label className="label">{label}</label>{children}</div> }
