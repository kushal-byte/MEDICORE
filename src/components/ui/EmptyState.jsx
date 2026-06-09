import { Inbox } from 'lucide-react'
export default function EmptyState({ title = 'Nothing here yet', hint, icon: Icon = Inbox, action }) {
  return (
    <div className="glass p-10 text-center">
      <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4">
        <Icon className="text-brand-400" size={24} />
      </div>
      <p className="font-semibold text-slate-200">{title}</p>
      {hint && <p className="text-sm text-slate-500 mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
