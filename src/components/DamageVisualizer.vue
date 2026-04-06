<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { PokemonType, CalcMode } from '../types/pokemon'
import { useTypeCalculator } from '../composables/useTypeCalculator'
import { TYPE_INFO } from '../data/typeChart'

interface Props {
  selectedTypes: PokemonType[]
  mode: CalcMode
}

const props = defineProps<Props>()

const selectedTypesRef = toRef(props, 'selectedTypes')
const modeRef = toRef(props, 'mode')
const { groupedResults } = useTypeCalculator(selectedTypesRef, modeRef)

// 倍率カテゴリの表示設定（等倍は非表示、チームモード用に拡張）
const categoryConfig = computed(() => [
  // 極耐性（チームモード用）
  { value: 0.05960464477539063, label: '×0.06', color: 'bg-indigo-100', textColor: 'text-indigo-800', iconSize: 14, type: 'resistance' },
  { value: 0.095367431640625, label: '×0.10', color: 'bg-indigo-100', textColor: 'text-indigo-800', iconSize: 16, type: 'resistance' },
  { value: 0.152587890625, label: '×0.15', color: 'bg-blue-50', textColor: 'text-blue-800', iconSize: 18, type: 'resistance' },
  // 標準耐性
  { value: 0.244140625, label: '×0.24', color: 'bg-blue-100', textColor: 'text-blue-800', iconSize: 20, type: 'resistance' },
  { value: 0.390625, label: '×0.39', color: 'bg-blue-200', textColor: 'text-blue-800', iconSize: 24, type: 'resistance' },
  { value: 0.625, label: '×0.625', color: 'bg-cyan-100', textColor: 'text-cyan-800', iconSize: 28, type: 'resistance' },
  // 標準弱点
  { value: 1.6, label: '×1.6', color: 'bg-orange-100', textColor: 'text-orange-800', iconSize: 40, type: 'weakness' },
  { value: 2.56, label: '×2.56', color: 'bg-red-100', textColor: 'text-red-800', iconSize: 48, type: 'weakness' },
  // 極弱点（チームモード用）
  { value: 4.096, label: '×4.10', color: 'bg-red-200', textColor: 'text-red-900', iconSize: 52, type: 'weakness' },
  { value: 6.5536, label: '×6.55', color: 'bg-red-300', textColor: 'text-red-900', iconSize: 56, type: 'weakness' },
  { value: 10.48576, label: '×10.5', color: 'bg-red-400', textColor: 'text-white', iconSize: 60, type: 'weakness' },
  { value: 16.777216, label: '×16.8', color: 'bg-red-500', textColor: 'text-white', iconSize: 64, type: 'weakness' },
])

// 倍率ごとのアイコンサイズスタイル
function getIconStyle(multiplier: number) {
  const config = categoryConfig.value.find(c => Math.abs(c.value - multiplier) < 0.01)
  if (!config) return { width: '32px', height: '32px' }
  return {
    width: `${config.iconSize}px`,
    height: `${config.iconSize}px`,
  }
}

// 表示するカテゴリのみフィルタ
const visibleCategories = computed(() => {
  return categoryConfig.value.filter(cat => {
    const results = groupedResults.value[cat.value.toString()]
    return results && results.length > 0
  })
})
</script>

<template>
  <div class="space-y-4">
    <!-- タイプ未選択時 -->
    <div v-if="selectedTypes.length === 0" class="text-center text-gray-500 py-8">
      タイプを選択してください
    </div>

    <!-- 倍率カテゴリ別表示 -->
    <div v-else class="space-y-px">
      <div
        v-for="cat in visibleCategories"
        :key="cat.value"
        class="p-4"
        :class="cat.color"
      >
        <div class="flex items-center gap-4">
          <!-- 倍率ラベル -->
          <div class="w-20 text-center">
            <span
              class="text-lg font-bold"
              :class="cat.textColor"
            >
              {{ cat.label }}
            </span>
          </div>

          <!-- タイプアイコン群 -->
          <div class="flex flex-wrap gap-1 items-center">
            <div
              v-for="result in groupedResults[cat.value.toString()]"
              :key="result.type"
              :title="`${TYPE_INFO[result.type].name}: ${result.multiplier.toFixed(3)}倍`"
            >
              <img
                :src="TYPE_INFO[result.type].iconPath"
                :alt="TYPE_INFO[result.type].name"
                class="object-contain"
                :style="getIconStyle(cat.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
