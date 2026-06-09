import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Stethoscope, Users, CalendarDays, Pill,
  Building2, BarChart3, Settings, UserCircle, Activity,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ALL = [
  { to: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard, roles: ['admin','doctor','receptionist','patient'] },
  { to: '/doctors',       label: 'Doctors',       icon: Stethoscope,     roles: ['admin','receptionist','patient'] },
  { to: '/patients',      label: 'Patients',      icon: Users,           roles: ['admin','doctor','receptionist'] },
  { to: '/appointments',  label: 'Appointments',  icon: CalendarDays,    roles: ['admin','doctor','receptionist','patient'] },
  { to: '/prescriptions', label: 'Prescriptions', icon: Pill,            roles: ['admin','doctor','patient'] },
  { to: '/departments',   label: 'Departments',   icon: Building2,       roles: ['admin'] },
  { to: '/reports',       label: 'Reports',       icon: BarChart3,       roles: ['admin'] },
  { to: '/profile',       label: 'Profile',       icon: UserCircle,      roles: ['admin','doctor','receptionist','patient'] },
  { to: '/settings',      label: 'Settings',      icon: Settings,        roles: ['admin','doctor','receptionist','patient'] },
]

export default function Sidebar({ open, onClose }) {
  const { role } = useAuth()
  const items = ALL.filter(i => !role || i.roles.includes(role))
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static z-40 top-0 left-0 h-full w-64 shrink-0 p-4 transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="glass h-full p-4 flex flex-col">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500 shadow-glow">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <p className="font-extrabold leading-none text-slate-50">MediCore</p>
              <p className="text-[11px] text-slate-500">Hospital OS</p>
            </div>
          </div>
          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                   ${isActive ? 'bg-brand-500/15 text-brand-400 border border-brand-400/20'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
          {role && (
            <div className="mt-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-500">Signed in as</span>
              <p className="font-semibold capitalize text-brand-400">{role}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
