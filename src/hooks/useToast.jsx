import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastCtx = createContext()
export const useToast = () => useContext(ToastCtx)

const ICON = { success: CheckCircle2, error: AlertTriangle, info: Info }
const RING = { success: 'border-emerald-400/40', error: 'border-red-400/40', info: 'border-brand-400/40' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), [])
  const push = useCallback((type, msg) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, type, msg }])
    setTimeout(() => remove(id), 3500)
  }, [remove])

  const api = {
    success: m => push('success', m),
    error:   m => push('error', m),
    info:    m => push('info', m),
  }

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,360px)]">
        {toasts.map(t => {
          const Icon = ICON[t.type] || Info
          return (
            <div key={t.id} className={`glass border ${RING[t.type]} px-4 py-3 flex items-start gap-3 animate-[fadeIn_.2s_ease]`}>
              <Icon size={18} className="mt-0.5 shrink-0 text-brand-400" />
              <p className="text-sm flex-1 text-slate-100">{t.msg}</p>
              <button onClick={() => remove(t.id)} className="text-slate-500 hover:text-slate-200"><X size={16} /></button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}
