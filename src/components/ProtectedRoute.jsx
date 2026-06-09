import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './ui/Spinner'

export default function ProtectedRoute({ children, allow }) {
  const { user, role, loading, isConfigured } = useAuth()
  const loc = useLocation()

  if (loading) return <Spinner full label="Authenticating…" />
  if (isConfigured && !user) return <Navigate to="/login" state={{ from: loc }} replace />
  if (allow && role && !allow.includes(role)) return <Navigate to="/dashboard" replace />
  return children
}
