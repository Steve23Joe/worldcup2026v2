export interface MatchRecord {
  match_id: string
  home_team_name: string
  away_team_name: string
  home_team_id: string
  away_team_id: string
  stage: string
  group_name: string | null
  kickoff_utc: string
  local_match_date?: string
  status: string
  home_score: number | null
  away_score: number | null
}

export interface PredictionRecord {
  match_id: string
  home_team_name: string
  away_team_name: string
  stage: string
  group_name: string | null
  kickoff_utc: string
  local_match_date: string
  market_home_win_probability: number
  market_draw_probability: number
  market_away_win_probability: number
  predicted_result: 'home_win' | 'draw' | 'away_win'
  confidence_level: 'high' | 'medium' | 'low'
  predicted_score: string
  predicted_home_goals: number
  predicted_away_goals: number
  score_confidence_level: 'low' | 'medium'
  odds_bookmaker_count: number
  odds_is_mock: boolean
  data_quality_flags: string[]
  score_prediction_flags: string[]
  analysis?: string
  disclaimer: string
}

export interface StandingEntry {
  group_name: string
  team_id: string
  team_name: string
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

export interface KnockoutMatch {
  match_id: string
  stage: string
  kickoff_utc: string
  home_team_name: string
  away_team_name: string
  home_score: number | null
  away_score: number | null
  status: string
}

export interface SummaryData {
  generated_at: string
  data_version: string
  build_id?: string
  match_count: number
  prediction_count: number
  odds_data_type: 'REAL' | 'MOCK'
  selected_matches: number
  matches_with_predictions: number
  matches_missing_odds: number
  disclaimer: string
}

export interface ManifestData {
  generated_at: string
  data_version: string
  build_id: string
  target_date: string | null
  timezone: string
  files: Record<string, string>
  disclaimer: string
}

export interface DashboardData {
  manifest: ManifestData
  summary: SummaryData
  predictions: PredictionRecord[]
  matches: MatchRecord[]
  standings: StandingEntry[]
  knockout: Record<string, KnockoutMatch[]>
}
