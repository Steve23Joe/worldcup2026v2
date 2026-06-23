<script setup lang="ts">
import { ref } from 'vue'
import type { PredictionRecord, SummaryData } from '../types/data'
import { safePct, fmtDate, teamResultLabel, confLabel, scoreConfLabel, teamNameCn } from '../utils/format'

const p = defineProps<{
  predictions: PredictionRecord[]
  summary: SummaryData | null
}>()

const expandedAnalysis = ref<Record<string, boolean>>({})

function toggleAnalysis(matchId: string) {
  expandedAnalysis.value[matchId] = !expandedAnalysis.value[matchId]
}

function isExpanded(matchId: string): boolean {
  return !!expandedAnalysis.value[matchId]
}
</script>

<template>
  <div>
    <div class="board-header">
      <h2>比赛预测</h2>
      <p v-if="summary" class="sub">
        {{ summary.matches_with_predictions }} / {{ summary.selected_matches }} 场比赛有赔率数据
        <span v-if="summary.matches_missing_odds > 0">
          · {{ summary.matches_missing_odds }} 场缺少赔率
        </span>
      </p>
    </div>

    <p v-if="predictions.length === 0" class="empty">暂无预测数据。请运行赔率流水线获取市场数据。</p>

    <div class="cards">
      <div v-for="pred in predictions" :key="pred.match_id" class="card">
        <div class="card-top">
          <div class="match-teams">
            <span class="teams">{{ teamNameCn(pred.home_team_name) }} vs {{ teamNameCn(pred.away_team_name) }}</span>
            <span class="stage-badge" v-if="pred.group_name">{{ pred.group_name }}组</span>
            <span class="stage-badge" v-else>{{ pred.stage }}</span>
          </div>
          <div class="kickoff">{{ fmtDate(pred.kickoff_utc) }} 北京时间</div>
        </div>

        <div class="probs-section">
          <div class="prob-row">
            <span class="prob-team">{{ teamNameCn(pred.home_team_name) }}</span>
            <span class="prob-pct">{{ safePct(pred.market_home_win_probability) }}</span>
            <div class="prob-bar-wrap">
              <div class="prob-bar home" :style="{ width: safePct(pred.market_home_win_probability) }"></div>
            </div>
          </div>
          <div class="prob-row">
            <span class="prob-team">平局</span>
            <span class="prob-pct">{{ safePct(pred.market_draw_probability) }}</span>
            <div class="prob-bar-wrap">
              <div class="prob-bar draw" :style="{ width: safePct(pred.market_draw_probability) }"></div>
            </div>
          </div>
          <div class="prob-row">
            <span class="prob-team">{{ teamNameCn(pred.away_team_name) }}</span>
            <span class="prob-pct">{{ safePct(pred.market_away_win_probability) }}</span>
            <div class="prob-bar-wrap">
              <div class="prob-bar away" :style="{ width: safePct(pred.market_away_win_probability) }"></div>
            </div>
          </div>
        </div>

        <div class="prediction-result">
          <div class="pred-main">
            <span class="pred-label">{{ teamResultLabel(pred.predicted_result, teamNameCn(pred.home_team_name), teamNameCn(pred.away_team_name)) }}</span>
            <span class="pred-score">{{ pred.predicted_score }}</span>
          </div>
          <div class="pred-details">
            <span>结果: {{ confLabel(pred.confidence_level) }}</span>
            <span>· 比分: {{ scoreConfLabel(pred.score_confidence_level) }}</span>
            <span>· {{ pred.odds_bookmaker_count }} 家博彩公司</span>
            <span :class="pred.odds_is_mock ? 'tag-mock' : 'tag-real'">
              {{ pred.odds_is_mock ? '模拟' : '真实' }}
            </span>
          </div>
        </div>

        <!-- 智能分析 -->
        <div v-if="pred.analysis" class="analysis-section">
          <button class="analysis-toggle" @click="toggleAnalysis(pred.match_id)">
            🤖 智能分析 {{ isExpanded(pred.match_id) ? '▲' : '▼' }}
          </button>
          <div v-if="isExpanded(pred.match_id)" class="analysis-content">
            <p>{{ pred.analysis }}</p>
          </div>
        </div>

        <div class="card-footer">
          <small class="disclaimer">{{ pred.disclaimer }}</small>
        </div>
      </div>
    </div>

    <p class="footer-note">分析数据仅供参考，不构成投注建议。</p>
  </div>
</template>

<style scoped>
.board-header { margin-bottom: 1.5rem; }
.board-header h2 { color: #f1f5f9; font-size: 1.3rem; }
.sub { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }
.cards { display: flex; flex-direction: column; gap: 1rem; }
.card { background: #1e293b; border-radius: 10px; padding: 1.25rem; border: 1px solid #334155; }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
.teams { font-size: 1.05rem; font-weight: 700; color: #f1f5f9; }
.stage-badge { font-size: 0.72rem; color: #64748b; background: #334155; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.kickoff { color: #94a3b8; font-size: 0.82rem; white-space: nowrap; }
.probs-section { margin-bottom: 0.75rem; }
.prob-row { display: flex; align-items: center; gap: 0.5rem; margin: 0.3rem 0; }
.prob-team { width: 120px; font-size: 0.82rem; color: #cbd5e1; flex-shrink: 0; text-align: right; }
.prob-pct { width: 48px; font-size: 0.8rem; color: #94a3b8; text-align: right; flex-shrink: 0; }
.prob-bar-wrap { flex: 1; height: 6px; background: #0f172a; border-radius: 3px; overflow: hidden; }
.prob-bar { height: 100%; border-radius: 3px; min-width: 2px; transition: width 0.3s; }
.prob-bar.home { background: #3b82f6; }
.prob-bar.draw { background: #eab308; }
.prob-bar.away { background: #ef4444; }
.prediction-result { margin-bottom: 0.25rem; }
.pred-main { display: flex; gap: 0.5rem; align-items: baseline; }
.pred-label { font-weight: 700; color: #38bdf8; font-size: 0.95rem; }
.pred-score { font-size: 0.9rem; color: #e2e8f0; }
.pred-details { display: flex; gap: 0.5rem; font-size: 0.78rem; color: #94a3b8; flex-wrap: wrap; margin-top: 0.3rem; }
.tag-mock { color: #fbbf24; font-weight: 600; }
.tag-real { color: #4ade80; font-weight: 600; }
.analysis-section { margin: 0.75rem 0; }
.analysis-toggle {
  background: #334155; border: none; color: #38bdf8; padding: 0.4rem 0.75rem;
  border-radius: 4px; cursor: pointer; font-size: 0.82rem; transition: background 0.2s;
}
.analysis-toggle:hover { background: #475569; }
.analysis-content {
  margin-top: 0.5rem; padding: 0.75rem; background: #0f172a;
  border-radius: 6px; border: 1px solid #334155;
}
.analysis-content p { color: #cbd5e1; font-size: 0.83rem; line-height: 1.6; margin: 0; }
.card-footer { margin-top: 0.5rem; }
.disclaimer { color: #64748b; font-size: 0.7rem; font-style: italic; }
.empty { color: #94a3b8; padding: 3rem 0; text-align: center; }
.footer-note { text-align: center; color: #475569; font-size: 0.75rem; margin-top: 1.5rem; }
@media (max-width: 500px) { .prob-team { width: 80px; font-size: 0.72rem; } }
</style>
