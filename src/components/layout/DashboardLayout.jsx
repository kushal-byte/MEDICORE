import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const TITLES = {
  '/dashboard': 'Dashboard', '/doctors': 'Doctors', '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/departments': 'Departments', '/reports': 'Reports',
  '/settings': 'Settings', '/profile': 'Profile',
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'MediCore'
  return (
    <div className="min-h-screen bg-glow">
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 min-w-0 p-4 lg:p-6 space-y-6">
          <Topbar onMenu={() => setOpen(true)} title={title} />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
