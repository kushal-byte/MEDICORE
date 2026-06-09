// Generic CSV exporter for patient / any records.
export function exportToCsv(filename, rows, columns) {
  if (!rows?.length) return
  const cols = columns || Object.keys(rows[0])
  const escape = v => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = cols.map(c => escape(c.label || c.key || c)).join(',')
  const body = rows.map(r =>
    cols.map(c => escape(typeof c === 'string' ? r[c] : (c.value ? c.value(r) : r[c.key]))).join(',')
  ).join('\n')
  const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename.endsWith('.csv') ? filename : filename + '.csv')
}

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
