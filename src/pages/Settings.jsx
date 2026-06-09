import { useState } from 'react'
import { Sun, Moon, Bell, LogOut, KeyRound, Database, Loader2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { useNavigate } from 'react-router-dom'

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="grid place-items-center w-10 h-10 rounded-lg bg-white/5 text-brand-400 shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-11 h-6 rounded-full transition relative ${on ? 'bg-brand-500' : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const { dark, toggle } = useTheme()
  const { user, reset, signOut, isConfigured } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [notif, setNotif] = useState(true)
  const [busy, setBusy] = useState(false)

  async function changePassword() {
    if (!isConfigured) return toast.error('Configure Supabase in .env first')
    if (!user?.email) return toast.error('No account email')
    setBusy(true)
    const { error } = await reset(user.email)
    setBusy(false)
    if (error) return toast.error(error.message)
    toast.success('Password reset link sent to ' + user.email)
  }

  async function out() { await signOut(); nav('/login') }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Card>
        <h3 className="font-bold text-slate-100 mb-1">Appearance</h3>
        <Row icon={dark ? Moon : Sun} title="Dark mode" desc="Switch between dark and light theme">
          <Toggle on={dark} onClick={toggle} />
        </Row>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-100 mb-1">Notifications</h3>
        <Row icon={Bell} title="In-app notifications" desc="Alerts for appointments and updates">
          <Toggle on={notif} onClick={() => setNotif(n => !n)} />
        </Row>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-100 mb-1">Account</h3>
        <Row icon={KeyRound} title="Password" desc="Send a reset link to your email">
          <button className="btn-ghost text-sm" onClick={changePassword} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={16} /> : 'Reset'}
          </button>
        </Row>
        <Row icon={Database} title="Database connection" desc="Supabase backend status">
          <span className={`badge ${isConfigured ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {isConfigured ? 'Connected' : 'Not configured'}
          </span>
        </Row>
        <Row icon={LogOut} title="Sign out" desc="End your current session">
          <button className="btn-ghost text-sm text-red-400" onClick={out}>Sign out</button>
        </Row>
      </Card>
    </div>
  )
}
