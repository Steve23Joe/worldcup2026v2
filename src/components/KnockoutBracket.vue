<script setup lang="ts">
import type { KnockoutMatch } from '../types/data'
import { fmtDate } from '../utils/format'

defineProps<{ knockout: Record<string, KnockoutMatch[]> }>()

const stageOrder = ['round_of_32', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final']
const stageLabels: Record<string, string> = {
  round_of_32: 'Round of 32', round_of_16: 'Round of 16',
  quarterfinal: 'Quarter-finals', semifinal: 'Semi-finals',
  third_place: '3rd Place Match', final: 'Final',
}
</script>

<template>
  <div>
    <p v-if="Object.keys(knockout).length === 0" class="empty">No knockout matches available yet.</p>
    <div v-for="stage in stageOrder" :key="stage">
      <template v-if="knockout[stage]?.length">
        <h3 class="stage-title">{{ stageLabels[stage] || stage }}</h3>
        <div class="ko-list">
          <div v-for="m in knockout[stage]" :key="m.match_id" class="ko-match">
            <div class="ko-teams">
              <span :class="{ winner: (m.home_score ?? 0) > (m.away_score ?? 0) }">{{ m.home_team_name }}</span>
              <span class="vs">vs</span>
              <span :class="{ winner: (m.away_score ?? 0) > (m.home_score ?? 0) }">{{ m.away_team_name }}</span>
            </div>
            <div class="ko-meta">
              <span>{{ fmtDate(m.kickoff_utc) }}</span>
              <span>{{ m.status }}</span>
              <span v-if="m.home_score !== null" class="ko-score">{{ m.home_score }} - {{ m.away_score }}</span>
              <span v-else class="ko-score">TBD</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.stage-title { color: #38bdf8; margin: 1.5rem 0 0.75rem; font-size: 1.1rem; }
.ko-list { display: flex; flex-direction: column; gap: 0.5rem; }
.ko-match { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; }
.ko-teams { font-weight: 500; }
.vs { color: #64748b; margin: 0 0.5rem; }
.winner { color: #4ade80; font-weight: 700; }
.ko-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #94a3b8; }
.ko-score { color: #e2e8f0; font-weight: 600; }
.empty { color: #94a3b8; padding: 2rem 0; text-align: center; }
</style>
