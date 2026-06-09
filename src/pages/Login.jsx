import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

export default function Login() {
  const { signIn, isConfigured } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(v) {
    if (!isConfigured) { toast.error('Configure Supabase in .env first'); return }
    setBusy(true)
    const { error } = await signIn(v.email, v.password)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Welcome back')
    nav('/dashboard')
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your MediCore account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={Mail} label="Email" error={errors.email?.message}>
          <input className="input pl-9" type="email" placeholder="you@hospital.io"
            {...register('email', { required: 'Email required' })} />
        </Field>
        <Field icon={Lock} label="Password" error={errors.password?.message}>
          <input className="input pl-9" type="password" placeholder="••••••••"
            {...register('password', { required: 'Password required' })} />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-slate-400 text-center mt-5">
        New here? <Link to="/register" className="text-brand-400 font-semibold hover:underline">Create account</Link>
      </p>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-glow grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-11 h-11 rounded-xl bg-brand-500 shadow-glow">
            <Activity className="text-white" size={22} />
          </div>
          <span className="text-xl font-extrabold">MediCore</span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Modern hospital<br />management,<br /><span className="text-brand-400">beautifully simple.</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-md">
            Appointments, prescriptions, analytics and role-based access — in one premium dashboard.
          </p>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} MediCore Health Systems</p>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
      </div>
      <div className="grid place-items-center p-6">
        <div className="glass w-full max-w-md p-8">
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <Activity className="text-brand-400" size={22} />
            <span className="text-lg font-extrabold">MediCore</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-50">{title}</h1>
          <p className="text-sm text-slate-400 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Field({ icon: Icon, label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
        {children}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
