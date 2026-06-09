import { useMemo, useState } from 'react'

// Client-side pagination + search helper.
export function usePagination(rows = [], { pageSize = 8, searchKeys = [] } = {}) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(q)))
  }, [rows, query, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, totalPages)
  const slice = filtered.slice((current - 1) * pageSize, current * pageSize)

  return {
    rows: slice, query, setQuery: q => { setQuery(q); setPage(1) },
    page: current, totalPages, setPage, total: filtered.length,
  }
}
