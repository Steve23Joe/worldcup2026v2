export function pct(v: number): string {
  return (v * 100).toFixed(1) + '%'
}

export function fmtDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace('Z', '+00:00'))
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })
  } catch { return iso }
}

export function resultLabel(r: string): string {
  const m: Record<string, string> = { home_win: 'Home Win', draw: 'Draw', away_win: 'Away Win' }
  return m[r] || r
}

export function confLabel(c: string): string {
  const m: Record<string, string> = { high: '🟢 High', medium: '🟡 Medium', low: '🔴 Low' }
  return m[c] || c
}

export function scoreConfLabel(c: string): string {
  return c === 'medium' ? '🟡 Medium' : '🔴 Low'
}
