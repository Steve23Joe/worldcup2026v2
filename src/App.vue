<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataStatus from './components/DataStatus.vue'
import PredictionBoard from './components/PredictionBoard.vue'
import MatchRecords from './components/MatchRecords.vue'
import GroupStandings from './components/GroupStandings.vue'
import KnockoutBracket from './components/KnockoutBracket.vue'
import type { ManifestData, SummaryData, PredictionRecord, MatchRecord, StandingEntry, KnockoutMatch as KOMatch } from './types/data'
import { loadDashboardData } from './utils/dataLoader'

const tabs = [
  { key: 'predictions', label: '预测分析' },
  { key: 'matches', label: '比赛记录' },
  { key: 'group_standings', label: '小组积分' },
  { key: 'knockout', label: '淘汰赛' },
] as const
type Tab = typeof tabs[number]['key']
const active = ref<Tab>('predictions')

const manifest = ref<ManifestData | null>(null)
const summary = ref<SummaryData | null>(null)
const predictions = ref<PredictionRecord[]>([])
const matches = ref<MatchRecord[]>([])
const standings = ref<StandingEntry[]>([])
const knockout = ref<Record<string, KOMatch[]>>({})
const loading = ref(true)
const error = ref('')
const refreshing = ref(false)

async function load() {
  loading.value = true; error.value = ''
  try {
    const data = await loadDashboardData()
    manifest.value = data.manifest
    summary.value = data.summary
    predictions.value = data.predictions
    matches.value = data.matches
    standings.value = data.standings
    knockout.value = data.knockout
  } catch (e: any) {
    error.value = '数据加载失败: ' + e.message
  } finally {
    loading.value = false; refreshing.value = false
  }
}

async function refresh() { refreshing.value = true; await load() }
function hardRefresh() { window.location.reload() }

const stale = computed(() => {
  if (!manifest.value?.generated_at) return false
  const gen = new Date(manifest.value.generated_at.replace('Z', '+00:00')).getTime()
  const now = Date.now()
  return (now - gen) > 24 * 3600 * 1000
})

onMounted(load)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <div>
          <h1>⚽ 2026世界杯数据看板</h1>
          <p class="subtitle">基于本地数据流水线的静态世界杯预测看板</p>
        </div>
        <DataStatus :manifest="manifest" :summary="summary" :predictions="predictions" :loading="loading" :error="error"
          :refreshing="refreshing" @refresh="refresh" />
      </div>
    </header>

    <nav class="tab-bar">
      <div class="tab-scroll">
        <button v-for="t in tabs" :key="t.key"
          :class="{ active: active === t.key }"
          @click="active = t.key">
          {{ t.label }}
        </button>
      </div>
    </nav>

    <main class="main-content">
      <div v-if="loading && !refreshing" class="state-msg">⏳ 正在加载数据...</div>
      <div v-else-if="refreshing" class="state-msg">🔄 刷新中...</div>
      <div v-else-if="error" class="state-msg error">{{ error }}
        <button class="retry-btn" @click="load">重试</button>
        <a href="#" @click.prevent="hardRefresh" class="hard-refresh">强制刷新</a>
      </div>
      <div v-if="stale && !loading" class="stale-warn">
        ⚠ 数据可能已过期 — 上次更新超过24小时。
        <a href="#" @click.prevent="refresh">立即刷新</a>
      </div>
      <template v-else-if="!error && !loading">
        <PredictionBoard v-if="active === 'predictions'" :key="manifest?.data_version || 'predictions'" :predictions="predictions" :summary="summary" />
        <MatchRecords v-if="active === 'matches'" :matches="matches" />
        <GroupStandings v-if="active === 'group_standings'" :standings="standings" />
        <KnockoutBracket v-if="active === 'knockout'" :knockout="knockout" />
      </template>
    </main>

    <footer class="app-footer">
      <small>{{ summary?.disclaimer || '分析数据仅供参考，不构成投注建议。' }}</small>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f172a; color: #e2e8f0; line-height: 1.6;
}
</style>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }
.app-header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 1.25rem 2rem; border-bottom: 1px solid #334155; }
.header-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
.app-header h1 { font-size: clamp(1.25rem, 3vw, 1.6rem); color: #f1f5f9; }
.subtitle { color: #64748b; font-size: 0.8rem; margin-top: 0.15rem; }
.tab-bar { background: #1e293b; border-bottom: 1px solid #334155; overflow-x: auto; }
.tab-scroll { display: flex; max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.tab-scroll button {
  background: none; border: none; color: #94a3b8; padding: 0.75rem 1.25rem;
  cursor: pointer; font-size: 0.9rem; white-space: nowrap;
  border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s;
}
.tab-scroll button:hover { color: #e2e8f0; }
.tab-scroll button.active { color: #38bdf8; border-bottom-color: #38bdf8; }
.main-content { flex: 1; padding: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
@media (max-width: 640px) { .main-content { padding: 1rem; } }
.app-footer { text-align: center; padding: 1.25rem; color: #64748b; border-top: 1px solid #334155; font-size: 0.8rem; }
.state-msg { text-align: center; padding: 3rem 0; font-size: 1.1rem; }
.error { color: #f87171; }
</style>

<style>
.stale-warn {
  background: rgba(251, 191, 36, 0.12); color: #fbbf24;
  padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.82rem;
  margin-bottom: 1rem; text-align: center;
}
.stale-warn a { color: #fbbf24; text-decoration: underline; }
.retry-btn {
  background: #1e293b; color: #e2e8f0; border: 1px solid #475569;
  padding: 4px 12px; border-radius: 4px; cursor: pointer; margin: 0 0.5rem;
}
.hard-refresh { color: #64748b; font-size: 0.75rem; margin-left: 0.5rem; }
</style>
