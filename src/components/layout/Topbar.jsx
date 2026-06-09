import { Menu, Sun, Moon, LogOut, Bell } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenu, title }) {
  const { dark, toggle } = useTheme()
  const { profile, signOut } = useAuth()
  const nav = useNavigate()
  async function out() { await signOut(); nav('/login') }
  return (
    <header className="glass px-4 py-3 flex items-center gap-3">
      <button className="lg:hidden btn-ghost px-2.5 py-2" onClick={onMenu}><Menu size={18} /></button>
      <h1 className="text-lg font-bold text-slate-100 flex-1">{title}</h1>
      <button className="btn-ghost px-2.5 py-2 relative">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400" />
      </button>
      <button className="btn-ghost px-2.5 py-2" onClick={toggle} title="Toggle theme">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="hidden sm:flex items-center gap-2 pl-2">
        <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-400/30 grid place-items-center text-sm font-bold text-brand-400">
          {(profile?.full_name || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-100">{profile?.full_name || 'User'}</p>
          <p className="text-[11px] text-slate-500 capitalize">{profile?.role || '—'}</p>
        </div>
      </div>
      <button className="btn-ghost px-2.5 py-2" onClick={out} title="Sign out"><LogOut size={18} /></button>
    </header>
  )
}
