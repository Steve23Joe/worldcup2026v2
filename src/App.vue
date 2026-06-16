<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataStatus from './components/DataStatus.vue'
import PredictionBoard from './components/PredictionBoard.vue'
import MatchRecords from './components/MatchRecords.vue'
import GroupStandings from './components/GroupStandings.vue'
import KnockoutBracket from './components/KnockoutBracket.vue'
import type { ManifestData, SummaryData, PredictionRecord, MatchRecord, StandingEntry, KnockoutMatch as KOMatch } from './types/data'

const tabs = ['predictions', 'matches', 'group_standings', 'knockout'] as const
type Tab = typeof tabs[number]
const active = ref<Tab>('predictions')

const manifest = ref<ManifestData | null>(null)
const summary = ref<SummaryData | null>(null)
const predictions = ref<PredictionRecord[]>([])
const matches = ref<MatchRecord[]>([])
const standings = ref<StandingEntry[]>([])
const knockout = ref<Record<string, KOMatch[]>>({})
const loading = ref(true)
const error = ref('')

async function loadData() {
  try {
    const [m, s, p, mt, st, ko] = await Promise.all([
      fetch('./data/manifest.json').then(r => r.json()),
      fetch('./data/summary.json').then(r => r.json()),
      fetch('./data/predictions.json').then(r => r.json()),
      fetch('./data/matches.json').then(r => r.json()),
      fetch('./data/group_standings.json').then(r => r.json()),
      fetch('./data/knockout_bracket.json').then(r => r.json()),
    ])
    manifest.value = m; summary.value = s
    predictions.value = p; matches.value = mt
    standings.value = st; knockout.value = ko
  } catch (e: any) {
    error.value = 'Failed to load data: ' + e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>⚽ WC2026 Dashboard</h1>
      <DataStatus :manifest="manifest" :summary="summary" :loading="loading" :error="error" />
    </header>

    <nav class="tab-bar">
      <button v-for="t in tabs" :key="t"
        :class="{ active: active === t }"
        @click="active = t">
        {{ t === 'group_standings' ? 'Group Standings' : t.charAt(0).toUpperCase() + t.slice(1) }}
      </button>
    </nav>

    <main class="main-content">
      <div v-if="loading">Loading data...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>
        <PredictionBoard v-if="active === 'predictions'" :predictions="predictions" :summary="summary" />
        <MatchRecords v-if="active === 'matches'" :matches="matches" />
        <GroupStandings v-if="active === 'group_standings'" :standings="standings" />
        <KnockoutBracket v-if="active === 'knockout'" :knockout="knockout" />
      </template>
    </main>

    <footer class="app-footer">
      <small>{{ summary?.disclaimer || 'Analytical output only. Not betting advice.' }}</small>
    </footer>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }
.app-header { background: #1e293b; padding: 1rem 2rem; border-bottom: 1px solid #334155; }
.app-header h1 { font-size: 1.5rem; color: #f1f5f9; }
.tab-bar { display: flex; gap: 0; background: #1e293b; padding: 0 2rem; border-bottom: 1px solid #334155; }
.tab-bar button {
  background: none; border: none; color: #94a3b8; padding: 0.75rem 1.25rem;
  cursor: pointer; font-size: 0.9rem; border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.tab-bar button:hover { color: #e2e8f0; }
.tab-bar button.active { color: #38bdf8; border-bottom-color: #38bdf8; }
.main-content { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
.app-footer { text-align: center; padding: 1.5rem; color: #64748b; border-top: 1px solid #334155; }
.error { color: #f87171; padding: 1rem; }
</style>
