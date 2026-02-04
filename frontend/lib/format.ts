export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const precision = unitIndex === 0 ? 0 : unitIndex === 1 ? 0 : 1
  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  // Normalize timestamps without timezone to UTC to avoid server/client differences.
  const hasTimezone = /[zZ]|[+-]\d{2}:\d{2}$/.test(iso)
  const normalized = hasTimezone ? iso : `${iso}Z`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return '—'

  // Use a fixed locale + timezone to prevent hydration mismatches.
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}
