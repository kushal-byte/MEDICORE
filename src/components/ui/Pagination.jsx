import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, totalPages, onChange, total }) {
  if (totalPages <= 1) return (
    <p className="text-xs text-slate-500 px-1 py-3">{total} record(s)</p>
  )
  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-xs text-slate-500">{total} record(s) · page {page}/{totalPages}</p>
      <div className="flex items-center gap-1.5">
        <button className="btn-ghost px-2.5 py-1.5" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        <button className="btn-ghost px-2.5 py-1.5" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
