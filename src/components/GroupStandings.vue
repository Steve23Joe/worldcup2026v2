<script setup lang="ts">
import { computed } from 'vue'
import type { StandingEntry } from '../types/data'

const props = defineProps<{ standings: StandingEntry[] }>()

const groups = computed(() => {
  const map: Record<string, StandingEntry[]> = {}
  for (const s of props.standings) {
    const g = s.group_name || '?'
    if (!map[g]) map[g] = []
    map[g].push(s)
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
})
</script>

<template>
  <div>
    <p v-if="standings.length === 0" class="empty">No standings data available yet.</p>
    <div v-for="[group, entries] in groups" :key="group" class="group-block">
      <h3>Group {{ group }}</h3>
      <table>
        <thead>
          <tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in entries" :key="e.team_id">
            <td>{{ i + 1 }}</td>
            <td class="team-name">{{ e.team_name }}</td>
            <td>{{ e.played }}</td><td>{{ e.wins }}</td><td>{{ e.draws }}</td>
            <td>{{ e.losses }}</td><td>{{ e.goals_for }}</td><td>{{ e.goals_against }}</td>
            <td>{{ e.goal_difference }}</td>
            <td class="pts">{{ e.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.group-block { margin-bottom: 2rem; }
.group-block h3 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.1rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { background: #1e293b; color: #94a3b8; padding: 0.4rem 0.5rem; text-align: center; }
td { padding: 0.35rem 0.5rem; border-bottom: 1px solid #1e293b; text-align: center; }
.team-name { text-align: left; font-weight: 500; }
.pts { font-weight: 700; color: #38bdf8; }
.empty { color: #94a3b8; padding: 2rem 0; text-align: center; }
</style>
