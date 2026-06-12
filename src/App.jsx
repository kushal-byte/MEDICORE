import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Patients from './pages/Patients'
import Appointments from './pages/Appointments'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  const { user, isConfigured } = useAuth()
  const authed = !isConfigured || user   // allow preview without creds

  return (
    <Routes>
      <Route path="/login" element={authed && isConfigured ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/doctors"       element={<Doctors />} />
        <Route path="/patients"      element={<ProtectedRoute allow={['admin','doctor','receptionist']}><Patients /></ProtectedRoute>} />
        <Route path="/appointments"  element={<Appointments />} />
        <Route path="/departments"   element={<ProtectedRoute allow={['admin']}><Departments /></ProtectedRoute>} />
        <Route path="/reports"       element={<ProtectedRoute allow={['admin']}><Reports /></ProtectedRoute>} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="/settings"      element={<Settings />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
