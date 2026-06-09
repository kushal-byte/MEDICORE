import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input className="input pl-9" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}
