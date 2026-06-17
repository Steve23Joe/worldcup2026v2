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
    <p v-if="standings.length > 0 && standings.length < 48" class="partial-warn">
      ⚠ Standings based on {{ standings.length }} teams (48 expected for full tournament). Partial data — only completed group-stage results shown.
    </p>
    <div class="group-grid">
      <div v-for="[group, entries] in groups" :key="group" class="group-card">
        <h3>Group {{ group }}</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead>
            <tbody>
              <tr v-for="(e, i) in entries" :key="e.team_id" :class="{ top2: i < 2 }">
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
    </div>
    <p class="note">Simplified standings: points, goal difference, goals for. Full FIFA tie-breakers not implemented.</p>
  </div>
</template>

<style scoped>
.group-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; }
@media (max-width: 420px) { .group-grid { grid-template-columns: 1fr; } }
.group-card { background: #1e293b; border-radius: 10px; padding: 1rem; border: 1px solid #334155; }
.group-card h3 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1rem; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
th { background: #0f172a; color: #94a3b8; padding: 0.3rem 0.35rem; text-align: center; font-size: 0.7rem; }
td { padding: 0.28rem 0.35rem; border-bottom: 1px solid #0f172a; text-align: center; }
.team-name { text-align: left; font-weight: 500; font-size: 0.8rem; }
.pts { font-weight: 700; color: #38bdf8; }
.top2 td { background: rgba(56, 189, 248, 0.05); }
.empty { color: #94a3b8; padding: 3rem 0; text-align: center; }
.partial-warn { color: #fbbf24; font-size: 0.82rem; margin-bottom: 1rem; padding: 0.5rem 0.75rem; background: rgba(251, 191, 36, 0.1); border-radius: 6px; }
.note { color: #475569; font-size: 0.72rem; margin-top: 1.5rem; text-align: center; }
</style>
