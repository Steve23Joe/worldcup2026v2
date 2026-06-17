import type { DashboardData, ManifestData, SummaryData, PredictionRecord, MatchRecord, StandingEntry, KnockoutMatch } from '../types/data'

const BASE = './data/'

/**
 * Fetch JSON with cache-busting and no-store. Never returns cached responses.
 */
export async function fetchJsonNoCache<T>(url: string): Promise<T> {
  const resp = await fetch(url, { cache: 'no-store' })
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`)
  return resp.json()
}

/**
 * Append a version query parameter to a URL for cache busting.
 */
export function withVersion(url: string, version: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${encodeURIComponent(version)}`
}

/**
 * Centralized dashboard data loader.
 *
 * Step 1: Fetch manifest with timestamp cache busting.
 * Step 2: Read manifest.data_version.
 * Step 3: Fetch all other JSONs with version cache busting.
 *
 * Logs diagnostics to console.info for debugging stale-data issues.
 */
export async function loadDashboardData(): Promise<DashboardData> {
  const ts = Date.now().toString()

  // Step 1 — manifest with timestamp bust
  const manifestUrl = `${BASE}manifest.json?t=${ts}`
  console.info('[dataLoader] Fetching manifest:', manifestUrl)
  const manifest = await fetchJsonNoCache<ManifestData>(manifestUrl)

  const version = manifest.data_version || ts
  console.info('[dataLoader] data_version:', version)

  // Step 2 — all other files with version bust
  const predictionsUrl = withVersion(`${BASE}${manifest.files.predictions || 'predictions.json'}`, version)
  const matchesUrl = withVersion(`${BASE}${manifest.files.matches || 'matches.json'}`, version)
  const standingsUrl = withVersion(`${BASE}${manifest.files.group_standings || 'group_standings.json'}`, version)
  const knockoutUrl = withVersion(`${BASE}${manifest.files.knockout_bracket || 'knockout_bracket.json'}`, version)
  const summaryUrl = withVersion(`${BASE}${manifest.files.summary || 'summary.json'}`, version)

  console.info('[dataLoader] Fetching predictions:', predictionsUrl)
  console.info('[dataLoader] Fetching matches:', matchesUrl)
  console.info('[dataLoader] Fetching standings:', standingsUrl)
  console.info('[dataLoader] Fetching knockout:', knockoutUrl)
  console.info('[dataLoader] Fetching summary:', summaryUrl)

  const [summary, predictions, matches, standings, knockout] = await Promise.all([
    fetchJsonNoCache<SummaryData>(summaryUrl),
    fetchJsonNoCache<PredictionRecord[]>(predictionsUrl),
    fetchJsonNoCache<MatchRecord[]>(matchesUrl),
    fetchJsonNoCache<StandingEntry[]>(standingsUrl),
    fetchJsonNoCache<Record<string, KnockoutMatch[]>>(knockoutUrl),
  ])

  // Diagnostics
  console.info('[dataLoader] predictions count:', predictions.length)
  if (predictions.length > 0) {
    const first = predictions[0]
    console.info('[dataLoader] first prediction:', `${first.home_team_name} vs ${first.away_team_name}`, '|', first.local_match_date)
  }
  console.info('[dataLoader] matches count:', matches.length)
  console.info('[dataLoader] data load complete')

  return { manifest, summary, predictions, matches, standings, knockout }
}
