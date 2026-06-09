import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, FileDown, Pill, Trash2 } from 'lucide-react'
import { prescriptionService } from '../services/prescriptionService'
import { doctorService } from '../services/doctorService'
import { patientService } from '../services/patientService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { usePagination } from '../hooks/usePagination'
import { generatePrescriptionPdf } from '../utils/generatePdf'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'

export default function Prescriptions() {
  const { role } = useAuth()
  const toast = useToast()
  const canWrite = ['admin', 'doctor'].includes(role)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const flat = rows.map(r => ({ ...r, patientName: r.patients?.full_name, doctorName: r.doctors?.full_name }))
  const { rows: page, query, setQuery, page: pg, totalPages, setPage, total } =
    usePagination(flat, { searchKeys: ['patientName', 'doctorName', 'diagnosis'] })

  async function load() {
    setLoading(true)
    try { setRows(await prescriptionService.list()) }
    catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search prescriptions…" />
        {canWrite && <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16} /> New prescription</button>}
      </div>

      {loading ? <Spinner /> : page.length === 0 ? (
        <EmptyState icon={Pill} title="No prescriptions" hint="Issue a prescription from a consultation." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {page.map(rx => (
            <Card key={rx.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-100">{rx.patientName || '—'}</p>
                  <p className="text-xs text-slate-500">by {rx.doctorName || '—'} · {new Date(rx.issued_at).toLocaleDateString()}</p>
                </div>
                <button className="btn-ghost px-2.5 py-1.5" onClick={() => generatePrescriptionPdf(rx)} title="Download PDF">
                  <FileDown size={15} />
                </button>
              </div>
              <p className="text-sm text-slate-300 mt-3"><span className="text-slate-500">Diagnosis:</span> {rx.diagnosis || '—'}</p>
              <div className="mt-2 space-y-1">
                {(rx.medicines || []).map((m, i) => (
                  <p key={i} className="text-xs text-slate-400">• {m.name} — {m.dosage}, {m.frequency}, {m.duration}</p>
                ))}
              </div>
              {rx.advice && <p className="text-xs text-slate-500 mt-2 italic">{rx.advice}</p>}
            </Card>
          ))}
          <div className="md:col-span-2"><Pagination page={pg} totalPages={totalPages} onChange={setPage} total={total} /></div>
        </div>
      )}

      {modal && <RxForm onClose={() => setModal(false)} onSaved={() => { setModal(false); load() }} />}
    </div>
  )
}

function RxForm({ onClose, onSaved }) {
  const toast = useToast()
  const { register, control, handleSubmit } = useForm({
    defaultValues: { medicines: [{ name: '', dosage: '', frequency: '', duration: '' }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'medicines' })
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
    const payload = {
      patient_id: v.patient_id, doctor_id: v.doctor_id,
      diagnosis: v.diagnosis, advice: v.advice,
      medicines: v.medicines.filter(m => m.name),
    }
    try { await prescriptionService.create(payload); toast.success('Prescription saved'); onSaved() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <Modal open onClose={onClose} title="New prescription" wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="label">Patient</label>
            <select className="input" {...register('patient_id', { required: true })}>
              <option value="" className="bg-navy-800">Select patient</option>
              {patients.map(p => <option key={p.id} value={p.id} className="bg-navy-800">{p.full_name}</option>)}
            </select>
          </div>
          <div><label className="label">Doctor</label>
            <select className="input" {...register('doctor_id', { required: true })}>
              <option value="" className="bg-navy-800">Select doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id} className="bg-navy-800">{d.full_name}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label">Diagnosis</label><input className="input" {...register('diagnosis')} /></div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label !mb-0">Medicines</label>
            <button type="button" className="btn-ghost px-2.5 py-1 text-xs"
              onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}>
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {fields.map((f, i) => (
              <div key={f.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="input col-span-4" placeholder="Name" {...register(`medicines.${i}.name`)} />
                <input className="input col-span-3" placeholder="Dosage" {...register(`medicines.${i}.dosage`)} />
                <input className="input col-span-2" placeholder="Freq" {...register(`medicines.${i}.frequency`)} />
                <input className="input col-span-2" placeholder="Duration" {...register(`medicines.${i}.duration`)} />
                <button type="button" className="btn-danger col-span-1 px-2 py-2" onClick={() => remove(i)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div><label className="label">Advice</label><textarea className="input min-h-20" {...register('advice')} /></div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save prescription'}</button>
        </div>
      </form>
    </Modal>
  )
}
