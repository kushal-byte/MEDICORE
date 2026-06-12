import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { AuthShell, Field } from './Login'

const ROLES = ['doctor', 'receptionist', 'admin']

export default function Register() {
  const { signUp, isConfigured } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { role: 'doctor' } })

  async function onSubmit(v) {
    if (!isConfigured) { toast.error('Configure Supabase in .env first'); return }
    setBusy(true)
    const { error } = await signUp(v.email, v.password, { full_name: v.full_name, role: v.role })
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Account created — check email to confirm, then sign in')
    nav('/login')
  }

  return (
    <AuthShell title="Create account" subtitle="Join MediCore in seconds">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={User} label="Full name" error={errors.full_name?.message}>
          <input className="input pl-9" placeholder="Jane Doe"
            {...register('full_name', { required: 'Name required' })} />
        </Field>
        <Field icon={Mail} label="Email" error={errors.email?.message}>
          <input className="input pl-9" type="email" placeholder="you@hospital.io"
            {...register('email', { required: 'Email required' })} />
        </Field>
        <Field icon={Lock} label="Password" error={errors.password?.message}>
          <input className="input pl-9" type="password" placeholder="min 6 chars"
            {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
        </Field>
        <Field icon={ShieldCheck} label="Role">
          <select className="input pl-9 appearance-none" {...register('role')}>
            {ROLES.map(r => <option key={r} value={r} className="bg-navy-800 capitalize">{r}</option>)}
          </select>
        </Field>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-slate-400 text-center mt-5">
        Already have an account? <Link to="/login" className="text-brand-400 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}
