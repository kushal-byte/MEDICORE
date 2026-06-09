export default function StatCard({ icon: Icon, label, value, accent = 'brand', sub }) {
  const ring = {
    brand: 'from-brand-500/30', emerald: 'from-emerald-500/30',
    violet: 'from-violet-500/30', amber: 'from-amber-500/30',
  }[accent]
  return (
    <div className="glass glass-hover p-5 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${ring} to-transparent blur-2xl`} />
      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold mt-1 text-slate-50">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
            <Icon size={22} className="text-brand-400" />
          </div>
        )}
      </div>
    </div>
  )
}
