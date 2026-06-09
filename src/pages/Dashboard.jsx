import { useEffect, useState } from 'react'
import {
  Users, Stethoscope, CalendarDays, CalendarClock, IndianRupee,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { dashboardService } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

const PIE = ['#3b6dff', '#5b8cff', '#7c5cff', '#22c1a4', '#f59e0b', '#ef4444']

const TIP = {
  contentStyle: { background: '#0d142e', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#e6ebff' },
  labelStyle: { color: '#9fb0e0' },
}

export default function Dashboard() {
  const { profile, role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [trends, setTrends] = useState([])
  const [depts, setDepts] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const [s, m, t, d] = await Promise.all([
          dashboardService.stats(),
          dashboardService.monthlyPatients(),
          dashboardService.appointmentTrends(),
          dashboardService.departmentStats(),
        ])
        setStats(s); setMonthly(m); setTrends(t); setDepts(d)
      } catch (e) { setErr(e.message || 'Failed to load dashboard') }
      finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <Spinner full />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-50">
          Hello, {profile?.full_name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="text-slate-400 text-sm capitalize">{role ? `${role} overview` : 'Overview'}</p>
      </div>

      {err && <Card className="border-red-400/30 text-red-300 text-sm">{err}</Card>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={Users}         label="Total Patients"      value={stats?.patients ?? 0} accent="brand" />
        <StatCard icon={Stethoscope}   label="Total Doctors"       value={stats?.doctors ?? 0} accent="violet" />
        <StatCard icon={CalendarDays}  label="Total Appointments"  value={stats?.appointments ?? 0} accent="emerald" />
        <StatCard icon={CalendarClock} label="Today's Appointments" value={stats?.todayAppointments ?? 0} accent="amber" />
        <StatCard icon={IndianRupee}   label="Revenue"             value={`₹${(stats?.revenue ?? 0).toLocaleString()}`} accent="emerald" sub="paid invoices" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-slate-100 mb-4">Monthly Patients</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b6dff" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#3b6dff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="name" stroke="#6b7aa0" fontSize={12} />
              <YAxis stroke="#6b7aa0" fontSize={12} allowDecimals={false} />
              <Tooltip {...TIP} />
              <Area type="monotone" dataKey="value" stroke="#5b8cff" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-100 mb-4">Department Statistics</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={depts.length ? depts : [{ name: 'No data', value: 1 }]}
                dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {depts.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip {...TIP} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {depts.map((d, i) => (
              <span key={d.name} className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE[i % PIE.length] }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-slate-100 mb-4">Appointment Trends</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
            <XAxis dataKey="name" stroke="#6b7aa0" fontSize={12} />
            <YAxis stroke="#6b7aa0" fontSize={12} allowDecimals={false} />
            <Tooltip {...TIP} cursor={{ fill: 'rgba(91,140,255,.08)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b6dff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
