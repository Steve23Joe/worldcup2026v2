<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MatchRecord } from '../types/data'
import { fmtDate } from '../utils/format'

const props = defineProps<{ matches: MatchRecord[] }>()
const filterStage = ref('')
const filterGroup = ref('')
const filterStatus = ref('')

const stages = computed(() => [...new Set(props.matches.map(m => m.stage))].sort())
const groups = computed(() => [...new Set(props.matches.map(m => m.group_name).filter(Boolean))].sort() as string[])
const statuses = ['scheduled', 'in_progress', 'completed']

const filtered = computed(() => {
  return props.matches.filter(m => {
    if (filterStage.value && m.stage !== filterStage.value) return false
    if (filterGroup.value && m.group_name !== filterGroup.value) return false
    if (filterStatus.value && m.status !== filterStatus.value) return false
    return true
  })
})
</script>

<template>
  <div>
    <div class="filters">
      <select v-model="filterStage"><option value="">All Stages</option><option v-for="s in stages" :key="s" :value="s">{{ s }}</option></select>
      <select v-model="filterGroup"><option value="">All Groups</option><option v-for="g in groups" :key="g" :value="g">Group {{ g }}</option></select>
      <select v-model="filterStatus"><option value="">All Status</option><option v-for="s in statuses" :key="s" :value="s">{{ s }}</option></select>
      <span class="count">{{ filtered.length }} matches</span>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Match</th><th>Stage</th><th>Group</th><th>Kickoff (JST)</th><th>Status</th><th>Score</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.match_id">
            <td>{{ m.home_team_name }} vs {{ m.away_team_name }}</td>
            <td>{{ m.stage }}</td>
            <td>{{ m.group_name || '—' }}</td>
            <td>{{ fmtDate(m.kickoff_utc) }}</td>
            <td><span :class="'status-' + m.status">{{ m.status }}</span></td>
            <td>{{ m.home_score !== null ? m.home_score + ' - ' + m.away_score : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; }
select { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; padding: 0.4rem 0.75rem; border-radius: 4px; }
.count { color: #94a3b8; font-size: 0.85rem; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { background: #1e293b; color: #94a3b8; padding: 0.6rem 0.75rem; text-align: left; font-weight: 600; }
td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #1e293b; }
tr:hover td { background: #1e293b; }
.status-completed { color: #4ade80; }
.status-in_progress { color: #fbbf24; }
.status-scheduled { color: #94a3b8; }
</style>
