import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { departmentService } from '../services/departmentService'
import { useToast } from '../hooks/useToast'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'

export default function Departments() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  async function load() {
    setLoading(true)
    try { setRows(await departmentService.list()) }
    catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function del(id) {
    if (!confirm('Delete department?')) return
    try { await departmentService.remove(id); toast.success('Deleted'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setModal({})}><Plus size={16} /> Add department</button>
      </div>
      {loading ? <Spinner /> : rows.length === 0 ? (
        <EmptyState icon={Building2} title="No departments" hint="Create your first department." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(d => (
            <Card key={d.id}>
              <div className="flex items-start justify-between">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-400/20">
                  <Building2 className="text-brand-400" size={20} />
                </div>
                <div className="flex gap-1">
                  <button className="btn-ghost px-2 py-1.5" onClick={() => setModal(d)}><Pencil size={14} /></button>
                  <button className="btn-danger px-2 py-1.5" onClick={() => del(d.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="font-bold text-slate-100 mt-3">{d.name}</p>
              <p className="text-sm text-slate-400 mt-1">{d.description || '—'}</p>
              <p className="text-xs text-slate-500 mt-2">Head: {d.head_name || '—'} · {d.location || '—'}</p>
            </Card>
          ))}
        </div>
      )}
      {modal && <DeptForm dept={modal.id ? modal : null}
        onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </div>
  )
}

function DeptForm({ dept, onClose, onSaved }) {
  const toast = useToast()
  const { register, handleSubmit } = useForm({ defaultValues: dept || {} })
  const [busy, setBusy] = useState(false)
  async function onSubmit(v) {
    setBusy(true)
    try {
      if (dept) await departmentService.update(dept.id, v)
      else await departmentService.create(v)
      toast.success('Saved'); onSaved()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <Modal open onClose={onClose} title={dept ? 'Edit department' : 'Add department'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div><label className="label">Name</label><input className="input" {...register('name', { required: true })} /></div>
        <div><label className="label">Description</label><input className="input" {...register('description')} /></div>
        <div><label className="label">Head</label><input className="input" {...register('head_name')} /></div>
        <div><label className="label">Location</label><input className="input" {...register('location')} /></div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  )
}
