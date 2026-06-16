<script setup lang="ts">
import type { ManifestData, SummaryData } from '../types/data'
defineProps<{
  manifest: ManifestData | null
  summary: SummaryData | null
  loading: boolean
  error: string
}>()
</script>

<template>
  <div class="data-status">
    <span v-if="loading">⏳ Loading data...</span>
    <template v-else-if="manifest && summary">
      <span :class="summary.odds_data_type === 'REAL' ? 'badge-real' : 'badge-mock'">
        {{ summary.odds_data_type }}
      </span>
      <span class="stat">{{ summary.match_count }} matches</span>
      <span class="stat">{{ summary.prediction_count }} predictions</span>
      <span class="stat">Updated {{ manifest.generated_at?.slice(0, 16) || '?' }}</span>
    </template>
    <span v-else-if="error" class="err">⚠ {{ error }}</span>
  </div>
</template>

<style scoped>
.data-status { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; font-size: 0.85rem; margin-top: 0.25rem; }
.stat { color: #94a3b8; }
.badge-real { background: #166534; color: #4ade80; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
.badge-mock { background: #713f12; color: #fbbf24; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
.err { color: #f87171; }
</style>
