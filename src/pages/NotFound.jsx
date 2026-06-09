import { Link } from 'react-router-dom'
import { Activity, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-glow grid place-items-center p-6">
      <div className="glass max-w-md w-full p-10 text-center">
        <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-brand-500 shadow-glow">
          <Activity className="text-white" size={26} />
        </div>
        <h1 className="mt-6 text-6xl font-extrabold text-slate-100">404</h1>
        <p className="mt-2 text-slate-400">Page not found. It may have been moved or never existed.</p>
        <Link to="/dashboard" className="btn-primary inline-flex mt-6">
          <Home size={16} /> Back to dashboard
        </Link>
      </div>
    </div>
  )
}
