<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MatchRecord } from '../types/data'
import { fmtDate, stageLabel, statusLabel, teamNameCn } from '../utils/format'

const props = defineProps<{ matches: MatchRecord[] }>()
const search = ref('')
const filterStage = ref('')
const filterGroup = ref('')
const filterStatus = ref('')

const stages = computed(() => [...new Set(props.matches.map(m => m.stage))].sort())
const groups = computed(() => [...new Set(props.matches.map(m => m.group_name).filter(Boolean))].sort() as string[])
const statuses = ['scheduled', 'in_progress', 'completed']

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  return props.matches.filter(m => {
    if (q && !m.home_team_name.toLowerCase().includes(q) && !m.away_team_name.toLowerCase().includes(q)) return false
    if (filterStage.value && m.stage !== filterStage.value) return false
    if (filterGroup.value && m.group_name !== filterGroup.value) return false
    if (filterStatus.value && m.status !== filterStatus.value) return false
    return true
  })
})

function scoreDisplay(m: MatchRecord) {
  if (m.status === 'completed' || m.status === 'in_progress') {
    if (m.home_score !== null && m.away_score !== null) return `${m.home_score} - ${m.away_score}`
  }
  return '—'
}
</script>

<template>
  <div>
    <div class="filters">
      <input v-model="search" type="text" placeholder="🔍 搜索球队..." class="search" />
      <select v-model="filterStage"><option value="">全部阶段</option><option v-for="s in stages" :key="s" :value="s">{{ stageLabel(s) }}</option></select>
      <select v-model="filterGroup"><option value="">全部小组</option><option v-for="g in groups" :key="g" :value="g">{{ g }}组</option></select>
      <select v-model="filterStatus"><option value="">全部状态</option><option v-for="s in statuses" :key="s" :value="s">{{ statusLabel(s) }}</option></select>
      <span class="count">共 {{ filtered.length }} 场</span>
    </div>
    <p v-if="filtered.length === 0" class="empty">未找到匹配的比赛。</p>
    <div v-else class="table-wrap">
      <table>
        <thead><tr><th>比赛</th><th>阶段</th><th>小组</th><th>开球 (北京时间)</th><th>状态</th><th>比分</th></tr></thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.match_id">
            <td class="match-cell">{{ teamNameCn(m.home_team_name) }} vs {{ teamNameCn(m.away_team_name) }}</td>
            <td>{{ stageLabel(m.stage) }}</td>
            <td>{{ m.group_name ? m.group_name + '组' : '—' }}</td>
            <td class="date-cell">{{ fmtDate(m.kickoff_utc) }}</td>
            <td><span :class="'status-' + m.status">{{ statusLabel(m.status) }}</span></td>
            <td class="score-cell">{{ scoreDisplay(m) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 0.6rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; }
.search { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; padding: 0.4rem 0.75rem; border-radius: 4px; min-width: 160px; font-size: 0.85rem; }
select { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; padding: 0.4rem 0.75rem; border-radius: 4px; font-size: 0.85rem; }
.count { color: #94a3b8; font-size: 0.82rem; margin-left: auto; }
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; border-collapse: collapse; font-size: 0.83rem; min-width: 600px; }
th { background: #1e293b; color: #94a3b8; padding: 0.5rem 0.6rem; text-align: left; font-weight: 600; white-space: nowrap; }
td { padding: 0.45rem 0.6rem; border-bottom: 1px solid #1e293b; }
tr:hover td { background: #1e293b; }
.match-cell { font-weight: 500; }
.date-cell { white-space: nowrap; color: #94a3b8; }
.score-cell { font-weight: 600; color: #e2e8f0; text-align: center; }
.status-completed { color: #4ade80; font-size: 0.78rem; }
.status-in_progress { color: #22d3ee; font-size: 0.78rem; font-weight: 600; }
.status-scheduled { color: #94a3b8; font-size: 0.78rem; }
.empty { color: #94a3b8; padding: 3rem 0; text-align: center; }
</style>
