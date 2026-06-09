import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { AuthShell, Field } from './Login'

export default function ForgotPassword() {
  const { reset, isConfigured } = useAuth()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(v) {
    if (!isConfigured) { toast.error('Configure Supabase in .env first'); return }
    setBusy(true)
    const { error } = await reset(v.email)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Reset link sent if the email exists')
  }

  return (
    <AuthShell title="Reset password" subtitle="We’ll email you a reset link">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={Mail} label="Email" error={errors.email?.message}>
          <input className="input pl-9" type="email" placeholder="you@hospital.io"
            {...register('email', { required: 'Email required' })} />
        </Field>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : 'Send reset link'}
        </button>
      </form>
      <p className="text-sm text-slate-400 text-center mt-5">
        <Link to="/login" className="text-brand-400 font-semibold hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  )
}
