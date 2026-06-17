export function safePct(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return '—'
  if (v > 1 && v <= 100) return v.toFixed(1) + '%'
  if (v >= 0 && v <= 1) return (v * 100).toFixed(1) + '%'
  return Math.max(0, Math.min(100, v)).toFixed(0) + '%'
}

export function fmtDate(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace('Z', '+00:00'))
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Tokyo',
    })
  } catch { return iso }
}

export function fmtDateShort(iso: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace('Z', '+00:00'))
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo',
    })
  } catch { return iso }
}

export function resultLabel(r: string): string {
  const m: Record<string, string> = {
    home_win: 'Home Win', draw: 'Draw', away_win: 'Away Win',
  }
  return m[r] || r
}

export function teamResultLabel(r: string, home: string, away: string): string {
  if (r === 'home_win') return `${home} Win`
  if (r === 'away_win') return `${away} Win`
  return 'Draw'
}

export function confLabel(c: string): string {
  const m: Record<string, string> = { high: '🟢 High', medium: '🟡 Medium', low: '🔴 Low' }
  return m[c] || c
}

export function scoreConfLabel(c: string): string {
  return c === 'medium' ? '🟡 Medium' : '🔴 Low'
}

export function stageLabel(s: string): string {
  const m: Record<string, string> = {
    group: 'Group Stage', round_of_32: 'Round of 32',
    round_of_16: 'Round of 16', quarterfinal: 'Quarterfinal',
    semifinal: 'Semifinal', third_place: 'Third Place', final: 'Final',
  }
  return m[s] || s
}

export function statusLabel(s: string): string {
  const m: Record<string, string> = {
    completed: 'Completed', scheduled: 'Scheduled',
    in_progress: 'Live',
  }
  return m[s] || s
}
