import { Loader2 } from 'lucide-react'
export default function Spinner({ label = 'Loading…', full = false }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-400 ${full ? 'h-[50vh]' : 'py-10'}`}>
      <Loader2 className="animate-spin text-brand-400" size={20} />
      <span className="text-sm">{label}</span>
    </div>
  )
}
