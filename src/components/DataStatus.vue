<script setup lang="ts">
import { computed } from 'vue'
import type { ManifestData, SummaryData, PredictionRecord } from '../types/data'

const props = defineProps<{
  manifest: ManifestData | null
  summary: SummaryData | null
  predictions: PredictionRecord[]
  loading: boolean
  error: string
  refreshing: boolean
}>()

defineEmits<{ refresh: [] }>()

const badge = computed(() => {
  if (!props.summary) return { cls: 'badge-unknown', text: 'UNKNOWN' }
  const t = props.summary.odds_data_type
  if (t === 'REAL') return { cls: 'badge-real', text: 'REAL' }
  if (t === 'MOCK') return { cls: 'badge-mock', text: 'MOCK' }
  return { cls: 'badge-unknown', text: 'MIXED' }
})

const versionMismatch = computed(() => {
  if (!props.manifest || !props.summary) return false
  return props.manifest.data_version !== props.summary.data_version
})

const countMismatch = computed(() => {
  if (!props.summary) return false
  return props.predictions.length !== props.summary.prediction_count
})

const firstPred = computed(() => {
  if (props.predictions.length === 0) return null
  const p = props.predictions[0]
  return `${p.home_team_name} vs ${p.away_team_name} — ${p.local_match_date}`
})
</script>

<template>
  <div class="data-status">
    <span v-if="loading" class="loading">⏳ Loading...</span>
    <template v-else-if="manifest && summary">
      <span :class="'badge ' + badge.cls">{{ badge.text }}</span>
      <span class="stat">{{ summary.match_count }} matches</span>
      <span class="stat">{{ summary.prediction_count }} predictions</span>
      <span v-if="manifest.target_date" class="stat">Target: {{ manifest.target_date }}</span>
      <span class="stat meta">manifest v{{ manifest.data_version }}</span>
      <span class="stat meta">summary v{{ summary.data_version }}</span>
      <button class="refresh-btn" :disabled="refreshing" @click="$emit('refresh')">
        {{ refreshing ? '↻' : '↻ Refresh' }}
      </button>
      <div class="source-note">
        <span v-if="summary.odds_data_type === 'MOCK'" class="warn">⚠ Mock — dev baseline only.</span>
        <span v-else class="ok">✓ Real market odds.</span>
        <span class="gen-at">Generated: {{ manifest.generated_at }}</span>
      </div>
      <!-- Mismatch warnings -->
      <div v-if="versionMismatch" class="warn mismatch">
        ⚠ Data version mismatch: manifest {{ manifest.data_version }} ≠ summary {{ summary.data_version }}. Refresh may be needed.
      </div>
      <div v-if="countMismatch" class="warn mismatch">
        ⚠ Prediction count mismatch: rendered {{ predictions.length }} ≠ summary {{ summary.prediction_count }}. Refresh may be needed.
      </div>
      <!-- First prediction debug line -->
      <div v-if="firstPred" class="first-pred-debug">
        📋 First: {{ firstPred }}
      </div>
    </template>
    <span v-else-if="error" class="err">⚠ {{ error }}</span>
  </div>
</template>

<style scoped>
.data-status { font-size: 0.82rem; display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
.stat { color: #94a3b8; }
.meta { color: #64748b; font-size: 0.7rem; font-family: monospace; }
.badge { padding: 2px 10px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.5px; }
.badge-real { background: #14532d; color: #4ade80; }
.badge-mock { background: #78350f; color: #fbbf24; }
.badge-unknown { background: #1e293b; color: #94a3b8; border: 1px solid #475569; }
.loading { color: #94a3b8; }
.err { color: #f87171; }
.source-note { width: 100%; font-size: 0.72rem; margin-top: -0.25rem; display: flex; gap: 0.75rem; align-items: center; }
.warn { color: #fbbf24; }
.ok { color: #4ade80; }
.gen-at { color: #64748b; }
.mismatch { width: 100%; background: rgba(251, 191, 36, 0.1); padding: 0.4rem 0.75rem; border-radius: 4px; font-size: 0.75rem; }
.first-pred-debug { width: 100%; color: #64748b; font-size: 0.7rem; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.refresh-btn {
  background: #334155; color: #e2e8f0; border: 1px solid #475569;
  padding: 2px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;
  transition: background 0.2s;
}
.refresh-btn:hover { background: #475569; }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
