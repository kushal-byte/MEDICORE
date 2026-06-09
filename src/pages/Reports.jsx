import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { dashboardService } from '../services/dashboardService'
import { patientService } from '../services/patientService'
import { exportToCsv } from '../utils/exportCsv'
import { Card } from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'

const TIP = {
  contentStyle: { background: '#0d142e', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#e6ebff' },
}

export default function Reports() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [monthly, setMonthly] = useState([])
  const [trends, setTrends] = useState([])
  const [depts, setDepts] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const [m, t, d] = await Promise.all([
          dashboardService.monthlyPatients(),
          dashboardService.appointmentTrends(),
          dashboardService.departmentStats(),
        ])
        setMonthly(m); setTrends(t); setDepts(d)
      } catch (e) { toast.error(e.message) } finally { setLoading(false) }
    })()
  }, [])

  async function exportPatients() {
    try {
      const rows = await patientService.list()
      exportToCsv('patient-records', rows, [
        { key: 'full_name', label: 'Name' }, { key: 'gender', label: 'Gender' },
        { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' },
        { key: 'blood_group', label: 'Blood' },
      ])
      toast.success('Patient records exported')
    } catch (e) { toast.error(e.message) }
  }

  if (loading) return <Spinner full />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={exportPatients}><Download size={16} /> Export patient records</button>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-slate-100 mb-4">Patient Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="name" stroke="#6b7aa0" fontSize={12} />
              <YAxis stroke="#6b7aa0" fontSize={12} allowDecimals={false} />
              <Tooltip {...TIP} />
              <Line type="monotone" dataKey="value" stroke="#5b8cff" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="font-bold text-slate-100 mb-4">Appointments / month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="name" stroke="#6b7aa0" fontSize={12} />
              <YAxis stroke="#6b7aa0" fontSize={12} allowDecimals={false} />
              <Tooltip {...TIP} cursor={{ fill: 'rgba(91,140,255,.08)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#7c5cff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h3 className="font-bold text-slate-100 mb-4">Doctors per department</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={depts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
            <XAxis type="number" stroke="#6b7aa0" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#6b7aa0" fontSize={12} width={110} />
            <Tooltip {...TIP} cursor={{ fill: 'rgba(91,140,255,.08)' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#22c1a4" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
