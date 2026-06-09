import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Shield, Save, Loader2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { supabase, isConfigured } from '../lib/supabase'

export default function Profile() {
  const { user, profile, role } = useAuth()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    reset({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    })
  }, [profile, reset])

  async function onSubmit(v) {
    if (!isConfigured) return toast.error('Configure Supabase in .env first')
    if (!user) return toast.error('Not signed in')
    setBusy(true)
    const { error } = await supabase.from('users')
      .update({ full_name: v.full_name, phone: v.phone })
      .eq('id', user.id)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Profile updated')
  }

  const initial = (profile?.full_name || user?.email || 'U').slice(0, 1).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
      <Card className="md:col-span-1 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-2xl bg-brand-500/20 border border-brand-400/30 grid place-items-center text-4xl font-extrabold text-brand-400">
          {initial}
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-100">{profile?.full_name || 'User'}</h2>
        <p className="text-sm text-slate-500 break-all">{user?.email || '—'}</p>
        <div className="mt-3"><Badge status={role || 'guest'} /></div>
      </Card>

      <Card className="md:col-span-2">
        <h3 className="font-bold text-slate-100 mb-4">Account details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input pl-9" placeholder="Jane Doe"
                {...register('full_name', { required: 'Name required' })} />
            </div>
            {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input pl-9" placeholder="+1 555 000 0000" {...register('phone')} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-9 opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-9 opacity-60 cursor-not-allowed capitalize" value={role || 'guest'} disabled />
              </div>
            </div>
          </div>

          <button className="btn-primary" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Save changes</>}
          </button>
        </form>
      </Card>
    </div>
  )
}
