<script setup lang="ts">
import type { KnockoutMatch } from '../types/data'
import { fmtDate, stageLabel, teamNameCn } from '../utils/format'

defineProps<{ knockout: Record<string, KnockoutMatch[]> }>()

const stageOrder = ['round_of_32', 'round_of_16', 'quarterfinal', 'semifinal', 'third_place', 'final']
const shortStatus: Record<string, string> = {
  completed: '完赛', in_progress: '进行中', scheduled: '待定',
}
</script>

<template>
  <div>
    <p v-if="Object.keys(knockout).length === 0" class="empty">暂无淘汰赛数据。</p>
    <div v-for="stage in stageOrder" :key="stage">
      <template v-if="knockout[stage]?.length">
        <h3 class="stage-heading">{{ stageLabel(stage) }}</h3>
        <div class="ko-grid">
          <div v-for="m in knockout[stage]" :key="m.match_id" class="ko-card">
            <div class="ko-teams">
              <span :class="{ winner: (m.home_score ?? 0) > (m.away_score ?? 0) }">{{ teamNameCn(m.home_team_name || '') || '待定' }}</span>
              <span class="vs">vs</span>
              <span :class="{ winner: (m.away_score ?? 0) > (m.home_score ?? 0) }">{{ teamNameCn(m.away_team_name || '') || '待定' }}</span>
            </div>
            <div class="ko-meta">
              <span>{{ fmtDate(m.kickoff_utc) }}</span>
              <span :class="'status-' + m.status">{{ shortStatus[m.status] || m.status }}</span>
              <span v-if="m.status === 'completed' && m.home_score !== null" class="ko-score">{{ m.home_score }} - {{ m.away_score }}</span>
              <span v-else class="ko-tbd">待定</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.stage-heading { color: #38bdf8; margin: 1.5rem 0 0.75rem; font-size: 1.05rem; padding-bottom: 0.3rem; border-bottom: 1px solid #1e293b; }
.ko-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.5rem; }
@media (max-width: 400px) { .ko-grid { grid-template-columns: 1fr; } }
.ko-card { background: #1e293b; border: 1px solid #334155; border-left: 3px solid #38bdf8; border-radius: 4px; padding: 0.7rem 1rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
.ko-teams { font-weight: 500; font-size: 0.9rem; min-width: 0; }
.vs { color: #475569; margin: 0 0.35rem; font-size: 0.8rem; }
.winner { color: #4ade80; font-weight: 700; }
.ko-meta { display: flex; gap: 0.75rem; font-size: 0.75rem; color: #94a3b8; flex-shrink: 0; align-items: center; }
.ko-score { color: #e2e8f0; font-weight: 700; font-size: 0.85rem; }
.ko-tbd { color: #475569; font-size: 0.8rem; }
.status-completed { color: #4ade80; font-weight: 600; }
.status-in_progress { color: #22d3ee; font-weight: 600; }
.status-scheduled { color: #94a3b8; }
.empty { color: #94a3b8; padding: 3rem 0; text-align: center; }
</style>
