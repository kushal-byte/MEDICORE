import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const AuthCtx = createContext()
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)   // { id, full_name, role, ... }
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    if (!userId) return setProfile(null)
    const { data } = await supabase.from('users').select('*').eq('id', userId).single()
    setProfile(data || null)
  }

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      loadProfile(data.session?.user?.id).finally(() => setLoading(false))
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      loadProfile(s?.user?.id)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn  = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signUp  = (email, password, meta) =>
    supabase.auth.signUp({ email, password, options: { data: meta } })
  const signOut = () => supabase.auth.signOut()
  const reset   = (email) => supabase.auth.resetPasswordForEmail(email,
    { redirectTo: window.location.origin + '/login' })

  const value = {
    session, user: session?.user || null, profile,
    role: profile?.role, loading, isConfigured,
    signIn, signUp, signOut, reset,
  }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
