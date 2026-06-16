<script setup lang="ts">
import type { PredictionRecord, SummaryData } from '../types/data'
import { pct, fmtDate, resultLabel, confLabel, scoreConfLabel } from '../utils/format'

defineProps<{
  predictions: PredictionRecord[]
  summary: SummaryData | null
}>()
</script>

<template>
  <div class="board">
    <div class="board-header">
      <h2>Match Predictions</h2>
      <p v-if="summary" class="sub">
        {{ summary.matches_with_predictions }}/{{ summary.selected_matches }} matches with odds
        <span v-if="summary.matches_missing_odds > 0">
          · {{ summary.matches_missing_odds }} missing odds
        </span>
      </p>
    </div>

    <p v-if="predictions.length === 0" class="empty">No predictions available. Run the odds pipeline to fetch market data.</p>

    <div class="cards">
      <div v-for="p in predictions" :key="p.match_id" class="card">
        <div class="match-header">
          <span class="teams">{{ p.home_team_name }} vs {{ p.away_team_name }}</span>
          <span class="stage" v-if="p.group_name">Group {{ p.group_name }}</span>
          <span class="stage" v-else>{{ p.stage }}</span>
        </div>

        <div class="probs">
          <div class="prob-bar">
            <div class="prob-fill home" :style="{ width: pct(p.market_home_win_probability) }"></div>
            <span class="prob-label">H {{ pct(p.market_home_win_probability) }}</span>
          </div>
          <div class="prob-bar">
            <div class="prob-fill draw" :style="{ width: pct(p.market_draw_probability) }"></div>
            <span class="prob-label">D {{ pct(p.market_draw_probability) }}</span>
          </div>
          <div class="prob-bar">
            <div class="prob-fill away" :style="{ width: pct(p.market_away_win_probability) }"></div>
            <span class="prob-label">A {{ pct(p.market_away_win_probability) }}</span>
          </div>
        </div>

        <div class="prediction">
          <div class="pred-row">
            <span class="pred-result">{{ resultLabel(p.predicted_result) }}</span>
            <span class="pred-score">({{ p.predicted_score }})</span>
          </div>
          <div class="pred-meta">
            <span>{{ confLabel(p.confidence_level) }}</span>
            <span>· {{ scoreConfLabel(p.score_confidence_level) }} score</span>
            <span>· {{ p.odds_bookmaker_count }} bookmakers</span>
            <span :class="p.odds_is_mock ? 'mock' : 'real'">
              {{ p.odds_is_mock ? 'MOCK' : 'REAL' }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <small>{{ fmtDate(p.kickoff_utc) }} JST</small>
          <small class="disclaimer">{{ p.disclaimer }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards { display: flex; flex-direction: column; gap: 1rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.25rem; border: 1px solid #334155; }
.match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.teams { font-size: 1.1rem; font-weight: 600; color: #f1f5f9; }
.stage { font-size: 0.8rem; color: #64748b; background: #334155; padding: 2px 8px; border-radius: 4px; }
.probs { margin-bottom: 0.75rem; }
.prob-bar { display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0; }
.prob-fill { height: 6px; border-radius: 3px; min-width: 2px; }
.prob-fill.home { background: #3b82f6; }
.prob-fill.draw { background: #eab308; }
.prob-fill.away { background: #ef4444; }
.prob-label { font-size: 0.8rem; color: #94a3b8; width: 60px; text-align: right; }
.prediction { margin-bottom: 0.5rem; }
.pred-row { display: flex; gap: 0.5rem; align-items: baseline; }
.pred-result { font-weight: 700; color: #38bdf8; font-size: 1rem; }
.pred-score { font-size: 0.9rem; color: #e2e8f0; }
.pred-meta { display: flex; gap: 0.5rem; font-size: 0.8rem; color: #94a3b8; flex-wrap: wrap; margin-top: 0.25rem; }
.mock { color: #fbbf24; } .real { color: #4ade80; }
.card-footer { display: flex; justify-content: space-between; margin-top: 0.5rem; color: #64748b; font-size: 0.75rem; }
.disclaimer { font-style: italic; }
.empty { color: #94a3b8; padding: 2rem 0; text-align: center; }
.board-header { margin-bottom: 1.5rem; }
.board-header h2 { color: #f1f5f9; }
.sub { color: #94a3b8; font-size: 0.9rem; margin-top: 0.25rem; }
</style>
