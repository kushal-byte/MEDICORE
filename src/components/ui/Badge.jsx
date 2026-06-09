const MAP = {
  scheduled:  'bg-brand-500/15 text-brand-400',
  confirmed:  'bg-emerald-500/15 text-emerald-400',
  completed:  'bg-violet-500/15 text-violet-300',
  cancelled:  'bg-red-500/15 text-red-400',
  no_show:    'bg-amber-500/15 text-amber-400',
  paid:       'bg-emerald-500/15 text-emerald-400',
  pending:    'bg-amber-500/15 text-amber-400',
}
export default function Badge({ status }) {
  const cls = MAP[status] || 'bg-white/10 text-slate-300'
  return <span className={`badge ${cls}`}>{String(status || '—').replace('_', ' ')}</span>
}
